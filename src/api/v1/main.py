import logging

from bson.json_util import loads
from pymongo.errors import DuplicateKeyError, PyMongoError
from tornado.gen import coroutine, Return, Future

from api.kube.exceptions import KubernetesException
from api.v1 import SecureWebSocketHandler
from api.v1.actions.instances import InstancesActions
from api.v1.actions.namespaces import NamespacesActions
from api.v1.actions.settings import SettingsActions
from api.v1.actions.users import UsersActions
from api.v1.watchers.cursor import CursorWatcher
from api.v1.watchers.kube import KubeWatcher
from data.query import ObjectNotFoundError

REST_OPERATIONS = ["create", "update", "delete"]
WATCH_OPERATIONS = ["watch", "unwatch"]
SUPPORTED_ACTIONS = ["users", "settings", "namespaces", "instances", "instance", "charts"]


class MainWebSocketHandler(SecureWebSocketHandler):

    def __init__(self, application, request, **kwargs):
        super(MainWebSocketHandler, self).__init__(application, request, **kwargs)

        self.connected = False
        self.current_watchers = dict()

        self.actions_lookup = dict(
            charts=dict(
                watcher_cls=CursorWatcher
            ),
            instance=dict(
                watcher_cls=KubeWatcher
            ),
            instances=dict(
                rest=InstancesActions(self.settings),
                watcher_cls=KubeWatcher
            ),
            namespaces=dict(
                rest=NamespacesActions(self.settings),
                watcher_cls=CursorWatcher
            ),
            settings=dict(
                rest=SettingsActions(self.settings),
                watcher_cls=CursorWatcher
            ),
            users=dict(
                rest=UsersActions(self.settings),
                watcher_cls=CursorWatcher
            )
        )

    def open(self):
        logging.info("Initializing MainWebSocketHandler")

        try:
            super(MainWebSocketHandler, self).open()
        except Exception as e:
            logging.exception(e)
            self.write_message({"error": {"message": "Cannot open connection"}})
            self.close()

    @coroutine
    def on_message(self, message):
        # Wait the user to be authenticated before accepting message
        if isinstance(self.user, Future):
            self.user = yield self.user

        if not self.user:
            raise Return()

        request = yield self.validate_message(message)
        if not request:
            raise Return()

        response = dict(
            action=request["action"],
            correlation=request["correlation"],
            operation=request["operation"],
            body={},
            status_code=200
        )

        if request["operation"] in REST_OPERATIONS:
            action = self.actions_lookup[request["action"]].get("rest", None)
            if action:
                if (not hasattr(type(action), request["operation"]) or
                        not callable(getattr(type(action), request["operation"]))):
                    error = "Operation %s not supported for action %s." % (request["operation"], request["action"])
                    response.update(dict(status_code=405, body=dict(message=error)))

                else:
                    if not action.check_permissions(self.user, request["operation"]):
                        error = "Operation %s forbidden for action %s." % (request["operation"], request["action"])
                        response.update(dict(status_code=403, body=dict(message=error)))

                    else:
                        try:
                            if request["operation"] == "create":
                                response["body"] = yield action.create(request["body"])
                                response["operation"] = "created"

                            elif request["operation"] == "update":
                                response["body"] = yield action.update(request["body"])
                                response["operation"] = "updated"

                            elif request["operation"] == "delete":
                                response["body"] = yield action.delete(request["body"]["_id"])
                                response["operation"] = "deleted"

                        except PyMongoError as e:
                            response["body"] = dict(message=e.message)
                            if isinstance(e, DuplicateKeyError):
                                response["status_code"] = 409
                            elif isinstance(e, ObjectNotFoundError):
                                response["status_code"] = 404
                            else:
                                response["status_code"] = 400
                        except KubernetesException as e:
                            response.update(dict(status_code=e.status_code, body=dict(message=e.message)))

            else:
                error = "Action %s does not support operations." % request["action"]
                response.update(dict(status_code=400, body=dict(message=error)))

            self.write_message(response)

        elif request["operation"] in WATCH_OPERATIONS:
            watcher_key = self._get_watcher_key(request)

            if request["operation"] == "watch":
                response["operation"] = "watched"

                watcher_cls = self.actions_lookup[request["action"]].get("watcher_cls", None)
                if watcher_cls:
                    if watcher_key in self.current_watchers.keys():
                        response["body"] = {"message": "Action already watched."}
                        response["status_code"] = 400
                        self.write_message(response)

                    else:
                        watcher = watcher_cls(request, self.settings, self.write_message)
                        yield watcher.watch()
                        self.current_watchers[watcher_key] = watcher
                else:
                    response["body"] = {"message": "Action not supported for operation watch."}
                    response["status_code"] = 400
                    self.write_message(response)

            elif request["operation"] == "unwatch":
                response["operation"] = "unwatched"
                if watcher_key in self.current_watchers.keys():
                    self.current_watchers[watcher_key].unwatch()
                    del self.current_watchers[watcher_key]
                    self.write_message(response)
                else:
                    response["body"] = {"message": "Action not previously watch."}
                    response["status_code"] = 400
                    self.write_message(response)

    @coroutine
    def on_close(self):
        logging.info("Closing MainWebSocketHandler")

        for key, watcher in self.current_watchers.iteritems():
            logging.debug("Closing watcher %s", key)
            watcher.unwatch()

        yield super(MainWebSocketHandler, self).on_close()

    @coroutine
    def validate_message(self, message):
        try:
            request = loads(message)
        except ValueError:
            self.write_message("Message '%s' cannot be deserialized" % message)
            raise Return(None)

        if "action" not in request:
            self.write_message("Message %s does not contain 'action'" % message)
            raise Return(None)

        if "operation" not in request:
            self.write_message("Message %s does not contain 'operation'" % message)
            raise Return(None)

        if "correlation" not in request:
            self.write_message("Message %s does not contain 'correlation'" % message)
            raise Return(None)

        if request["action"] not in SUPPORTED_ACTIONS:
            self.write_message(dict(
                action=request["action"],
                operation=request["operation"],
                correlation=request["correlation"],
                body={"message": "Action %s not supported." % request["action"]},
                status_code=400
            ))

            raise Return(None)

        if request["operation"] not in (REST_OPERATIONS + WATCH_OPERATIONS):
            self.write_message(dict(
                action=request["action"],
                operation=request["operation"],
                correlation=request["correlation"],
                body={"message": "Operation %s not supported." % request["operation"]},
                status_code=400
            ))

            raise Return(None)

        raise Return(request)

    @staticmethod
    def _get_watcher_key(message):
        watcher_key = message["action"]

        if "body" in message:
            if "namespace" in message["body"]:
                watcher_key += ".%s" % message["body"]["namespace"]

            if "kind" in message["body"]:
                watcher_key += ".%s" % message["body"]["kind"]

            if "name" in message["body"]:
                watcher_key += ".%s" % message["body"]["name"]

        return watcher_key

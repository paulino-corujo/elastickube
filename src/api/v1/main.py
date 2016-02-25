import logging

from bson.json_util import loads
from pymongo.errors import DuplicateKeyError
from tornado.gen import coroutine, Return

from api.v1 import SecureWebSocketHandler
from api.v1.watchers.charts import ChartsWatcher
from api.v1.watchers.instances import InstancesWatcher
from api.v1.watchers.namespaces import NamespacesWatcher
from api.v1.watchers.settings import SettingsWatcher
from api.v1.watchers.users import UsersWatcher
from api.v1.actions.namespace import NamespaceActions
from api.v1.actions.setting import SettingActions
from api.v1.actions.user import UserActions
from data.query import ObjectNotFoundException

REST_OPERATIONS = ["create", "update", "delete"]
WATCH_OPERATIONS = ["watch", "unwatch"]
SUPPORTED_ACTIONS = ["users", "settings", "namespaces", "instances", "charts"]


class MainWebSocketHandler(SecureWebSocketHandler):

    def __init__(self, application, request, **kwargs):
        super(MainWebSocketHandler, self).__init__(application, request, **kwargs)

        self.connected = False
        self.current_watchers = dict()

        self.actions_lookup = dict(
            instances=dict(
                watchers=InstancesWatcher(self.settings, self.write_message)
            ),
            charts=dict(
                watchers=ChartsWatcher(self.settings, self.write_message)
            ),
            namespaces=dict(
                rest=NamespaceActions(self.settings),
                watchers=NamespacesWatcher(self.settings, self.write_message)
            ),
            settings=dict(
                rest=SettingActions(self.settings),
                watchers=SettingsWatcher(self.settings, self.write_message)
            ),
            users=dict(
                rest=UserActions(self.settings),
                watchers=UsersWatcher(self.settings, self.write_message)
            )
        )

    @coroutine
    def open(self):
        logging.info("Initializing MainWebSocketHandler")

        try:
            yield super(MainWebSocketHandler, self).open()
        except Exception as e:
            logging.exception(e)
            self.write_message({"error": {"message": "Cannot open connection"}})
            self.close()

    @coroutine
    def on_message(self, message):
        request = yield self.validate_message(message)
        if not request:
            raise Return()

        response = dict(
            action=request["action"],
            body={},
            status_code=200
        )

        if "correlation" in request:
            response["correlation"] = request["correlation"]

        if request["operation"] in REST_OPERATIONS:
            action = self.actions_lookup[request["action"]].get("rest", None)
            if action:
                if request["operation"] == "create":
                    response["operation"] = "created"

                    try:
                        response["body"] = yield action.create(request["body"])
                    except DuplicateKeyError as e:
                        response["body"] = {"message": e.message}
                        response["status_code"] = 409

                elif request["operation"] == "update":
                    response["operation"] = "updated"
                    response["body"] = yield action.update(request["body"])

                elif request["operation"] == "delete":
                    response["operation"] = "deleted"

                    try:
                        response["body"] = yield action.delete(request["body"]["_id"])
                    except ObjectNotFoundException:
                        response["body"] = {"message": "%s %s not found." % (request["action"], request["body"]["_id"])}
                        response["status_code"] = 404
            else:
                response["status_code"] = 400
                response["body"] = {
                    "message": "Operation %s not supported for action %s." % (request["operation"], request["action"])
                }

            self.write_message(response)

        elif request["operation"] in WATCH_OPERATIONS:
            if request["operation"] == "watch":

                response["operation"] = "watched"

                watcher = self.actions_lookup[request["action"]].get("watchers", None)
                if watcher:
                    if request["action"] in self.current_watchers.keys():
                        response["body"] = {"message": "Action already watched."}
                        response["status_code"] = 400
                        self.write_message(response)

                    else:

                        self.current_watchers[request["action"]] = watcher.watch(request)
                else:
                    response["body"] = {"message": "Action not supported for operation watch."}
                    response["status_code"] = 400
                    self.write_message(response)

            elif request["operation"] == "unwatch":
                response["operation"] = "unwatched"

                if request["action"] in self.current_watchers.keys():
                    watcher = self.actions_lookup[request["action"]].get("watchers", None)
                    watcher.unwatch()
                    del self.current_watchers[request["action"]]

                    self.write_message(response)
                else:
                    response["body"] = {"message": "Action not previously watch."}
                    response["status_code"] = 400
                    self.write_message(response)

    @coroutine
    def on_close(self):
        logging.info("Closing MainWebSocketHandler")

        for watcher_key in self.current_watchers.keys():
            watcher = self.actions_lookup[watcher_key].get("watchers", None)
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

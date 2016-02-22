import logging

from bson.json_util import loads
from pymongo.errors import DuplicateKeyError
from tornado.gen import coroutine, Return

from data.query import ObjectNotFoundException
from api.v1 import SecureWebSocketHandler
from api.v1.watchers.namespaces import NamespacesWatcher
from api.v1.watchers.instances import InstancesWatcher
from api.v1.watchers.users import UsersWatcher
from api.v1.actions.namespace import NamespaceActions
from api.v1.actions.user import UserActions


action_lookup = dict(
    users=UserActions,
    namespaces=NamespaceActions
)


class MainWebSocketHandler(SecureWebSocketHandler):

    def __init__(self, application, request, **kwargs):
        super(MainWebSocketHandler, self).__init__(application, request, **kwargs)

        self.connected = False
        self.current_watchers = dict()

        self.watcher_lookup = dict(
            instances=InstancesWatcher(self.settings, self.write_response),
            namespaces=NamespacesWatcher(self.settings, self.write_response),
            users=UsersWatcher(self.settings, self.write_response)
        )

    @coroutine
    def open(self):
        logging.info("Initializing MainWebSocketHandler")

        try:
            yield super(MainWebSocketHandler, self).open()

        except Exception as e:
            logging.exception(e)
            if self.connected:
                self.write_message({"error": {"message": "Failed to connect to event source."}})

    @coroutine
    def on_message(self, message):
        try:
            document = loads(message)
        except ValueError:
            self.write_message("Message %s cannot be deserialized" % message)
            raise Return()

        status_code = 200
        if "action" in document and document["operation"] in ["create", "update", "delete"]:
            action_cls = action_lookup.get(document['action'], None)
            if action_cls:
                action = action_cls(document, self.settings)
                if 'operation' in document:
                    result = None
                    if document['operation'] == 'create':
                        try:
                            result = yield action.create(document['body'])
                        except DuplicateKeyError as e:
                            status_code = 409
                            result = {"message": e.message}
                    elif document['operation'] == 'update':
                        result = yield action.update(document['body'])
                    elif document['operation'] == 'delete':
                        try:
                            result = yield action.delete(document["body"]["_id"])
                        except ObjectNotFoundException:
                            status_code = 404
                            result = {"message": "Object not found."}

                self.write_response(document, result, status_code=status_code)
            else:
                self.write_response(document, {"message": "Action not supported."}, status_code=400)

        elif "action" in document and document["operation"] == "watch":
            watcher = self.watcher_lookup.get(document["action"], None)
            if watcher:
                if document["action"] in self.current_watchers.keys():
                    self.write_response(document, {"message": "Action already watched."}, status_code=400)
                else:
                    self.current_watchers[document["action"]] = watcher.watch(document)
            else:
                self.write_response(document, {"message": "Action not supported for operation watch."}, status_code=400)
        elif "action" in document and document["operation"] == "unwatch":
            if document["action"] in self.current_watchers.keys():
                watcher = self.watcher_lookup.get(document["action"], None)
                watcher.close()
                del self.current_watchers[document["action"]]
                self.write_response(document, {})
            else:
                self.write_response(document, {"message": "Action not previously watch."}, status_code=400)

        if "close" in message:
            self.close()

    @coroutine
    def on_close(self):
        logging.info("Closing MainWebSocketHandler")

        for watcher_key in self.current_watchers.keys():
            watcher = self.watcher_lookup.get(watcher_key, None)
            watcher.close()

        yield super(MainWebSocketHandler, self).on_close()

    def write_response(self, document, body, status_code=200):
        document['operation'] += "d" if document['operation'].endswith("e") else "ed"
        document['status_code'] = status_code
        document['body'] = body

        if status_code != 200:
            logging.warning(document)

        self.write_message(document)

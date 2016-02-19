import logging

from bson.json_util import loads
from tornado.gen import coroutine, Return

from data.query import Query
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

watch_lookup = dict(
    namespaces=NamespacesWatcher,
    instances=InstancesWatcher,
    users=UsersWatcher
)


class MainWebSocketHandler(SecureWebSocketHandler):

    def __init__(self, application, request, **kwargs):
        super(MainWebSocketHandler, self).__init__(application, request, **kwargs)

        self.connected = False
        self.global_watchers = []
        self.current_watchers = dict()

    @coroutine
    def open(self):
        logging.info("Initializing NamespacesHandler")

        try:
            yield super(MainWebSocketHandler, self).open()

            ns_watcher = NamespacesWatcher(self.settings, None, self.write_message)
            self.global_watchers.append(ns_watcher)

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

        if "action" in document and document["operation"] in ["create", "update", "delete"]:
            action_cls = action_lookup.get(document['action'], None)
            if action_cls:
                action = action_cls(document, self.settings)
                if 'operation' in document:
                    result = None
                    if document['operation'] == 'create':
                        result = yield action.create(document['body'])
                    elif document['operation'] == 'update':
                        result = yield action.update(document['body'])
                    elif document['operation'] == 'delete':
                        result = yield action.delete(document["body"]["_id"])

                self.write_response(document, result)
            else:
                self.write_response(document, {"message": "Action not supported."}, status_code=400)

        elif "action" in document and document["operation"] == "watch":
            watcher_cls = watch_lookup.get(document["action"], None)
            if watcher_cls:
                if document["action"] in self.current_watchers.keys():
                    self.write_response(document, {"message": "Action already watched."}, status_code=400)
                else:
                    initial_documents = yield Query(self.settings['database'], document['action'].title()).find()
                    self.current_watchers[document["action"]] = watcher_cls(document, self.settings, self.write_message)
                    self.write_response(document, initial_documents)
            else:
                self.write_response(document, {"message": "Action not supported for operation watch."}, status_code=400)
        elif "action" in document and document["operation"] == "unwatch":
            if document["action"] in self.current_watchers.keys():
                self.current_watchers[document["action"]].close()
                del self.current_watchers[document["action"]]
                self.write_response(document, {})
            else:
                self.write_response(document, {"message": "Action not previously watch."}, status_code=400)

        if "close" in message:
            self.close()

    @coroutine
    def on_close(self):
        logging.info("Closing NamespacesHandler")

        for watcher in self.global_watchers:
            watcher.close()

        for watcher in self.current_watchers.values():
            watcher.close()

        yield super(MainWebSocketHandler, self).on_close()

    def write_response(self, document, body, status_code=200):
        document['operation'] += "d" if document['operation'].endswith("e") else "ed"
        document['status_code'] = status_code
        document['body'] = body

        if status_code != 200:
            logging.warning(document)

        self.write_message(document)

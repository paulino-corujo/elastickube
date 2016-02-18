import logging

from api.v1 import SecureWebSocketHandler
from api.v1.watchers.namespaces import NamespacesWatcher
from api.v1.watchers.instances import InstancesWatcher
from api.v1.watchers.users import UsersWatcher
from api.v1.actions.user import UserActions
from bson.json_util import loads
from tornado.gen import coroutine, sleep

action_lookup = dict(
    users=UserActions
)

watch_lookup = dict(
    nasmespaces=NamespacesWatcher,
    instances=InstancesWatcher,
    users=UsersWatcher
)


class MainWebSocketHandler(SecureWebSocketHandler):

    def __init__(self, application, request, **kwargs):
        super(MainWebSocketHandler, self).__init__(application, request, **kwargs)

        self.connected = False
        self.global_watchers = []
        self.current_watcher = None

    @coroutine
    def open(self):
        logging.info("Initializing NamespacesHandler")

        try:
            yield super(MainWebSocketHandler, self).open()

            ns_watcher = NamespacesWatcher(None, self.settings, self.write_message)
            self.global_watchers.append(ns_watcher)

        except Exception as e:
            logging.exception(e)
            if self.connected:
                self.write_message({"error": {"message": "Failed to connect to event source."}})

    @coroutine
    def on_message(self, message):
        document = loads(message)

        if 'action' in document:
            action_cls = action_lookup.get(document['action'], None)
            if action_cls:
                action = action_cls(document, self.settings)
                if 'operation' in document:
                    if document['operation'] == 'create':
                        document['result'] = yield action.create(document['body'])
                    elif document['operation'] == 'update':
                        document['result'] = yield action.update(document['body'])
                    elif document['operation'] == 'delete':
                        document['result'] = yield action.delete(document['body'])

                del document['body']
                self.write_message(document)
            else:
                self.write_message({"error": {"message": "Action not supported."}})

        elif "watch" in document:
            if self.current_watcher:
                self.current_watcher.close()

            watcher_cls = watch_lookup.get(document["watch"], None)
            if watcher_cls:
                self.current_watcher = watcher_cls(document, self.settings, self.write_message)
            else:
                logging.warning("Watcher not supported, %s", message)
                self.write_message({"error": {"message": "Watcher not supported."}})

        if "close" in message:
            self.close()

    @coroutine
    def on_close(self):
        logging.info("Closing NamespacesHandler")

        for watcher in self.global_watchers:
            watcher.close()

        if self.current_watcher:
            self.current_watcher.close()

        yield super(MainWebSocketHandler, self).on_close()

import logging

from tornado.gen import coroutine, Return

from data.query import Query
from data.watch import add_callback, remove_callback

ACTIONS_TO_COLLECTIONS_MAP = {
    "users": "Users",
    "namespaces": "Namespaces",
    "settings": "Settings",
    "charts": "Charts"
}


class CursorWatcher(object):

    def __init__(self, message, settings, callback):
        logging.info("Initializing CursorWatcher")

        self.callback = callback
        self.message = message
        self.settings = settings

        self.validate_message()

    @coroutine
    def watch(self):
        logging.info("Starting watch for collection %s" % ACTIONS_TO_COLLECTIONS_MAP[self.message["action"]])

        data = yield Query(self.settings["database"], ACTIONS_TO_COLLECTIONS_MAP[self.message["action"]]).find()
        self.callback(dict(
            action=self.message["action"],
            operation="watched",
            correlation=self.message["correlation"],
            status_code=200,
            body=data
        ))

        add_callback(ACTIONS_TO_COLLECTIONS_MAP[self.message["action"]], self.data_callback)

    @coroutine
    def data_callback(self, document):
        logging.info("CursorWatcher for collection %s data_callback" %
                     ACTIONS_TO_COLLECTIONS_MAP[self.message["action"]])

        operation = "updated"
        if document["op"] == "i":
            operation = "created"
        elif document["op"] == "d":
            operation = "deleted"

        self.callback(dict(
            action=self.message["action"],
            operation=operation,
            status_code=200,
            body=document["o"]
        ))

        raise Return()

    def unwatch(self):
        logging.info("Stopping watch for collection %s" % ACTIONS_TO_COLLECTIONS_MAP[self.message["action"]])
        remove_callback(ACTIONS_TO_COLLECTIONS_MAP[self.message["action"]], self.data_callback)

    def validate_message(self):
        if self.message["action"] not in ACTIONS_TO_COLLECTIONS_MAP.keys():
            self.write_message(dict(
                action=self.message["action"],
                operation=self.message["operation"],
                correlation=self.message["correlation"],
                body={"message": "Action %s not supported by CursorWatcher" % self.message["action"]},
                status_code=400
            ))

            raise RuntimeError()

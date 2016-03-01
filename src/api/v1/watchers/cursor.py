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

ACTION_PROJECTIONS = {
    "users": {'password': 0}
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
        action = self.message["action"]
        logging.info("Starting watch for collection %s" % ACTIONS_TO_COLLECTIONS_MAP[action])
        projection = ACTION_PROJECTIONS[action] if action in ACTION_PROJECTIONS else None
        data = yield Query(self.settings["database"], ACTIONS_TO_COLLECTIONS_MAP[action]).find(projection=projection)
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
            body=self._filter_data(document["o"])
        ))

        raise Return()

    def unwatch(self):
        logging.info("Stopping watch for collection %s" % ACTIONS_TO_COLLECTIONS_MAP[self.message["action"]])
        remove_callback(ACTIONS_TO_COLLECTIONS_MAP[self.message["action"]], self.data_callback)

    def validate_message(self):
        if self.message["action"] not in ACTIONS_TO_COLLECTIONS_MAP.keys():
            self.callback(dict(
                action=self.message["action"],
                operation=self.message["operation"],
                correlation=self.message["correlation"],
                body={"message": "Action %s not supported by CursorWatcher" % self.message["action"]},
                status_code=400
            ))

            raise RuntimeError()

    def _filter_data(self, document):
        action = self.message["action"]
        fields_to_filter = ACTION_PROJECTIONS[action] if action in ACTION_PROJECTIONS else None
        if fields_to_filter is not None:
            for field in fields_to_filter:
                if field in document:
                    del document[field]
        return document

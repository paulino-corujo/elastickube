import logging

from tornado.gen import coroutine, Return

from data.query import Query
from data.watch import add_callback, remove_callback


class SettingsWatcher(object):

    def __init__(self, settings, callback):
        logging.info("Initializing SettingsWatcher")

        self.settings = settings
        self.callback = callback
        self.message = None

    @coroutine
    def watch(self, message):
        logging.info("Starting watch Settings")

        self.message = message

        settings = yield Query(self.settings["database"], "Settings").find()
        self.callback(dict(
            action=self.message["action"],
            operation="watched",
            correlation=self.message["correlation"],
            status_code=200,
            body=settings
        ))

        add_callback("Settings", self.data_callback)

    @coroutine
    def data_callback(self, document):
        logging.debug("SettingsWatcher data_callback")

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
        logging.info("Stopping watch Settings")
        remove_callback("Settings", self.data_callback)
        self.message = None

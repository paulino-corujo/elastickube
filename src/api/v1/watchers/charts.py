import logging

from tornado.gen import coroutine, Return

from data.query import Query
from data.watch import add_callback, remove_callback


class ChartsWatcher(object):

    def __init__(self, settings, callback):
        logging.info("Initializing ChartsWatcher")

        self.settings = settings
        self.callback = callback
        self.message = None

    @coroutine
    def watch(self, message):
        logging.info("Starting watch Charts")

        self.message = message

        charts = yield Query(self.settings["database"], "Charts").find()
        response = dict(
            action=self.message["action"],
            operation="watched",
            status_code=200,
            body=charts
        )

        if "correlation" in self.message:
            response["correlation"] = self.message["correlation"]

        self.callback(response)
        add_callback("Charts", self.data_callback)

    @coroutine
    def data_callback(self, document):
        logging.info("ChartsWatcher data_callback")

        operation = "updated"
        if document["op"] == "u":
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
        logging.info("Stopping watch Charts")
        remove_callback("elastickube.Charts", self.data_callback)
        self.message = None

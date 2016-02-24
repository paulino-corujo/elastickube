import logging

from tornado.gen import coroutine, Return

from data.query import Query
from data.watch import add_callback, remove_callback


class NamespacesWatcher(object):

    def __init__(self, settings, callback):
        logging.info("Initializing NamespacesWatcher")

        self.settings = settings
        self.callback = callback
        self.message = None

    @coroutine
    def watch(self, message):
        logging.info("Starting watch Namespaces")

        self.message = message

        namespaces = yield Query(self.settings["database"], "Namespaces").find()
        response = dict(
            action=self.message["action"],
            operation="watched",
            status_code=200,
            body=namespaces
        )

        if "correlation" in self.message:
            response["correlation"] = self.message["correlation"]

        self.callback(response)
        add_callback("Namespaces", self.data_callback)

    @coroutine
    def data_callback(self, document):
        logging.debug("NamespacesWatcher data_callback")

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
        logging.info("Stopping watch Namespaces")
        remove_callback("Namespaces", self.data_callback)
        self.message = None

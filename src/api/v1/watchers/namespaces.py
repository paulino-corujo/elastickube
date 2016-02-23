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
        self.callback(dict(
            action=self.message["action"],
            operation="watched",
            correlation=self.message["correlation"],
            status_code=200,
            body=namespaces
        ))

        add_callback("Namespaces", self.data_callback)

    @coroutine
    def data_callback(self, document):
        logging.debug("NamespacesWatcher data_callback")
        self.callback(dict(
            action=self.message["action"],
            operation="watched",
            status_code=200,
            body=document
        ))

        raise Return()

    def unwatch(self):
        logging.info("Stopping watch Namespaces")
        remove_callback('elastickube.Namespaces', self.data_callback)
        self.message = None

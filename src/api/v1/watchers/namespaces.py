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

        initial_documents = yield Query(self.settings["database"], "Namespaces").find()
        yield self.data_callback(initial_documents)

        add_callback("Namespaces", self.data_callback)

    @coroutine
    def data_callback(self, document):
        logging.debug("Namespace '%(name)s' saved", document['metadata'])
        self.callback(self.message, document, status_code=200)
        raise Return()

    def close(self):
        logging.info("Closing NamespacesWatcher")
        remove_callback('elastickube.Namespaces', self.data_callback)
        self.message = None

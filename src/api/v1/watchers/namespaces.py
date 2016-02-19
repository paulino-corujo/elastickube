import logging

from data.watch import add_callback, remove_callback
from tornado.gen import coroutine, Return


class NamespacesWatcher(object):

    def __init__(self, message, settings, callback):
        logging.info("Initializing NamespacesWatcher")

        self.callback = callback
        add_callback('Namespaces', self.data_callback)

    @coroutine
    def data_callback(self, document):
        logging.debug("Namespace '%(name)s' saved", document['metadata'])
        self.callback(document)

        raise Return()

    def close(self):
        logging.info("Closing NamespacesWatcher")
        remove_callback('elastickube.Namespaces', self.data_callback)

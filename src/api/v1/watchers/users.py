import logging

from tornado.gen import coroutine, Return

from data.query import Query
from data.watch import add_callback, remove_callback


class UsersWatcher(object):

    def __init__(self, settings, callback):
        logging.info("Initializing UsersWatcher")

        self.settings = settings
        self.callback = callback
        self.message = None

    @coroutine
    def watch(self, message):
        logging.info("Starting watch Users")

        self.message = message

        initial_documents = yield Query(self.settings["database"], "Users").find()
        yield self.data_callback(initial_documents)

        add_callback("Users", self.data_callback)

    @coroutine
    def data_callback(self, document):
        logging.info("UsersWatcher data_callback")
        self.callback(self.message, document, status_code=200)
        raise Return()

    def close(self):
        logging.info("Closing UsersWatcher")
        remove_callback("elastickube.Users", self.data_callback)
        self.message = None

import logging

from tornado.gen import coroutine, Return
from data.watch import add_callback, remove_callback


class UsersWatcher(object):

    def __init__(self, message, kubeclient, callback):
        logging.info("Initializing UsersWatcher")

        self.callback = callback
        add_callback("Users", self.data_callback)

    @coroutine
    def data_callback(self, document):
        logging.debug("User '%(email)s' saved", document)

        self.callback(document)
        raise Return()

    def close(self):
        logging.info("Closing UsersWatcher")
        remove_callback("elastickube.Users", self.data_callback)

import logging

from tornado.gen import coroutine, Return

from api.db import watch


class UsersWatcher(object):

    def __init__(self, message, kubeclient, callback):
        logging.info("Initializing UsersWatcher")

        self.callback = callback
        watch.add_callback("Users", self.data_callback)

    @coroutine
    def data_callback(self, document):
        logging.debug("User '%(email)' saved", document)
        self.callback(document)

        raise Return()

    def close(self):
        logging.info("Closing UsersWatcher")
        watch.remove_callback("elastickube.Users", self.data_callback)

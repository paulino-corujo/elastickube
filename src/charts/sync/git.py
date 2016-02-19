import logging

from data.query import Query
from datetime import datetime
from tornado.gen import coroutine, Return


class GitSync(object):

    def __init__(self, settings):
        logging.info("Initializing GitSync")
        self.database = settings['database']

    @coroutine
    def sync(self, document):
        logging.info("Creating user")

        user = yield Query(self.database, "Users").insert(document)
        raise Return(user)

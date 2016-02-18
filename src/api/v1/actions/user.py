import logging

from api.db.query import Query
from datetime import datetime
from tornado.gen import coroutine, Return


class UserActions(object):

    def __init__(self, message, settings):
        logging.info("Initializing UserActions")
        self.database = settings['database']

    @coroutine
    def create(self, document):
        logging.info("Creating user")
        user = yield self.database.Users.insert(document)

        raise Return(user)

    @coroutine
    def update(self, document):
        logging.info("Closing UsersWatcher")

        user = yield Query(self.database, "Users").find_one(document['_id'])
        user['firstname'] = document['firstname']
        user['lastname'] = document['lastname']

        yield Query(self.database, "Users").save(user)

        raise Return(user)

    @coroutine
    def delete(self):
        logging.info("Closing UsersWatcher")

        user = yield Query(self.database, "Users").find_one(document['_id'])
        user['deleted'] = datetime.now()

        yield Query(self.database, "Users").save(user)

        raise Return(user)

import logging

from data.query import Query
from datetime import datetime
from tornado.gen import coroutine, Return


class UserActions(object):

    def __init__(self, message, settings):
        logging.info("Initializing UserActions")
        self.database = settings['database']

    @coroutine
    def create(self, document):
        logging.info("Creating user")

        user = yield Query(self.database, "Users").insert(document)
        raise Return(user)

    @coroutine
    def update(self, document):
        logging.info("Updating user")

        user = yield Query(self.database, "Users").find_one(document['_id'])
        user['firstname'] = document['firstname']
        user['lastname'] = document['lastname']

        yield Query(self.database, "Users").update(user)

        raise Return(user)

    @coroutine
    def delete(self, user_id):
        logging.info("Deleting user")

        user = yield Query(self.database, "Users").find_one({"_id": user_id})
        if user is None:
            logging.error("User is None")

        user['deleted'] = datetime.utcnow().isoformat()
        yield Query(self.database, "Users").update(user)
        logging.info("Deleting user")
        raise Return(user)

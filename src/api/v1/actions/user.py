import logging
from datetime import datetime

from bson.objectid import ObjectId
from tornado.gen import coroutine, Return

from data.query import Query, ObjectNotFoundException


class UserActions(object):

    def __init__(self, settings):
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
        logging.info("Deleting user %s", user_id)

        user = yield Query(self.database, "Users").find_one({"_id": ObjectId(user_id)})
        if user is not None:
            user['deleted'] = datetime.utcnow().isoformat()
            yield Query(self.database, "Users").update(user)
        else:
            raise ObjectNotFoundException()

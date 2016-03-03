import logging
from datetime import datetime

from bson.objectid import ObjectId
from tornado.gen import coroutine, Return

from data.query import Query, ObjectNotFoundError


class UsersActions(object):

    def __init__(self, settings):
        logging.info("Initializing UsersActions")
        self.database = settings['database']

    @staticmethod
    def check_permissions(user, operation):
        logging.debug("Checking permissions for user %s and operation %s on users", user["username"], operation)
        if operation in ["create", "delete"] and user["role"] != "administrator":
            return False

        return True

    @coroutine
    def create(self, document):
        logging.debug("Creating user %s ", document)

        user = yield Query(self.database, "Users").insert(document)
        raise Return(user)

    @coroutine
    def update(self, document):
        logging.debug("Updating user")

        user = yield Query(self.database, "Users").find_one({"_id": ObjectId(document['_id'])})

        yield Query(self.database, "Users").update(user)

        raise Return(user)

    @coroutine
    def delete(self, document):
        logging.info("Deleting user %s", document["_id"])

        user = yield Query(self.database, "Users").find_one({"_id": ObjectId(document["_id"])})
        if user is not None:
            user["metadata"]["deletionTimestamp"] = datetime.utcnow().isoformat()
            yield Query(self.database, "Users").update(user)
        else:
            raise ObjectNotFoundError("users %s not found." % document["_id"])

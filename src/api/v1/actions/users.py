import logging
from datetime import datetime

from bson.objectid import ObjectId
from tornado.gen import coroutine, Return

from data.query import Query, ObjectNotFoundError


class UsersActions(object):

    def __init__(self, settings, user):
        logging.info("Initializing UsersActions")

        self.database = settings['database']
        self.user = user

    def check_permissions(self, operation, document):
        logging.debug("check_permissions for user %s and operation %s on users", self.user["username"], operation)
        if operation in ["create", "delete"] and self.user["role"] != "administrator":
            return False

        if operation == "update" and str(self.user["_id"]) != document["_id"] and self.user["role"] != "administrator":
            return False

        if (operation == "update" and
                self.user["_id"] == document["_id"] and
                self.user["role"] == "user" and
                self.user["role"] != document["role"]):
            return False

        return True

    @coroutine
    def update(self, document):
        logging.debug("Updating user %s", document["_id"])

        user = yield Query(self.database, "Users").find_one({"_id": ObjectId(document['_id'])})
        if not user:
            raise ObjectNotFoundError("User %s not found." % document["_id"])

        updated_user = yield Query(self.database, "Users").update(document)
        raise Return(updated_user)

    @coroutine
    def delete(self, document):
        logging.info("Deleting user %s", document["_id"])

        user = yield Query(self.database, "Users").find_one({"_id": ObjectId(document["_id"])})
        if user is not None:
            user["metadata"]["deletionTimestamp"] = datetime.utcnow().isoformat()
            yield Query(self.database, "Users").update(user)
        else:
            raise ObjectNotFoundError("User %s not found." % document["_id"])

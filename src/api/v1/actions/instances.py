import logging

from bson.objectid import ObjectId
from tornado.gen import coroutine, Return

from data.query import Query


class InstancesActions(object):

    def __init__(self, settings):
        logging.info("Initializing InstancesActions")
        self.kube = settings["kube"]
        self.database = settings["database"]

    def check_permissions(self, _user, _operation, _body):
        return True

    @coroutine
    def create(self, document):
        logging.info("Creating instance for request %s", document)

        try:
            chart = yield Query(self.database, "Charts").find_one({"_id": ObjectId(document["uid"])})
            for resource in chart["resources"]:
                yield self.kube[resource["kind"].lower() + "s"].post(resource, namespace="default")
        except Exception as e:
            logging.exception(e)

        raise Return({})

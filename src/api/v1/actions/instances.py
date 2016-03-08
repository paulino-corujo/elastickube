import logging

from bson.objectid import ObjectId
from tornado.gen import coroutine, Return

from data.query import Query, ObjectNotFoundError


class InstancesActions(object):

    def __init__(self, settings, user):
        logging.info("Initializing InstancesActions")

        self.kube = settings["kube"]
        self.database = settings["database"]
        self.user = user

    def check_permissions(self, operation, _document):
        logging.debug("check_permissions for user %s and operation %s on instances", self.user["username"], operation)
        return True

    @coroutine
    def create(self, document):
        logging.debug("Creating instance for request %s", document)

        namespace = document["namespace"]

        chart = yield Query(self.database, "Charts").find_one({"_id": ObjectId(document["uid"])})
        if chart is None:
            raise ObjectNotFoundError("Cannot find Chart %s" % document["uid"])

        result = []
        for resource in chart["resources"]:
            response = yield self.kube[self.kube.get_resource_type(resource["kind"])].post(
                resource, namespace=namespace)
            result.append(response)

        raise Return(result)

    @coroutine
    def delete(self, document):
        logging.debug("Deleting instance for request %s", document)

        if document["kind"] == "ReplicationController":
            response = yield self.kube[self.kube.get_resource_type(document["kind"])].patch(
                document["name"], dict(spec=dict(replicas=0)), namespace=document["namespace"])
            logging.debug("Updated ReplicationController %s", response)

        response = yield self.kube[self.kube.get_resource_type(document["kind"])].delete(
            document["name"], namespace=document["namespace"])

        raise Return(response)

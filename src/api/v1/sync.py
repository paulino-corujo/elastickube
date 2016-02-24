import logging
import time

from tornado.gen import coroutine

from api.kube.exceptions import WatchDisconnectedException
from data.query import Query


class SyncNamespaces(object):

    def __init__(self, settings):
        logging.info("Initializing SyncNamespaces")

        self.settings = settings
        self.resource_version = None

    @coroutine
    def start_sync(self):
        @coroutine
        def data_callback(data):
            logging.debug("Calling data_callback for SyncNamespaces")

            self.resource_version = data["object"]["metadata"]["resourceVersion"]

            if data["type"] == "ADDED":
                yield Query(self.settings["database"], "Namespaces").insert(dict(
                    _id=data["object"]["metadata"]["uid"],
                    metadata=dict(
                        name=data["object"]["metadata"]["name"],
                        labels=data["object"]["metadata"]["labels"]
                    )
                ))

            elif data["type"] == "DELETED":
                yield Query(self.settings["database"], "Namespaces").update_fields(
                    {"_id": data["object"]["metadata"]["uid"]},
                    {"metadata.deletionTimestamp": time.time()})

            else:
                yield Query(self.settings["database"], "Namespaces").update_fields(
                    {"_id": data["object"]["metadata"]["uid"]},
                    {"metadata.labels": data["object"]["metadata"]["labels"]})

        def done_callback(future):
            logging.warn("Disconnected from kubeclient in SyncNamespaces")

            if future and future.exception():
                logging.exception(future.exception())

            if future is None or isinstance(future.exception(), WatchDisconnectedException):
                watcher = self.settings["kube"].namespaces.watch(
                    resource_version=self.resource_version,
                    on_data=data_callback)

                watcher.add_done_callback(done_callback)

        self.resource_version = None
        try:
            result = yield self.settings["kube"].namespaces.get()
            for item in result.get("items", []):
                item["_id"] = item["metadata"]["uid"]
                self.settings["database"].Namespaces.save(item)

            self.resource_version = result["metadata"]["resourceVersion"]
            watcher = self.settings["kube"].namespaces.watch(
                resource_version=self.resource_version,
                on_data=data_callback)
            watcher.add_done_callback(done_callback)

        except Exception as e:
            logging.exception(e)

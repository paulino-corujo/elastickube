import logging

from tornado.gen import coroutine, Return

from api.kube.exceptions import WatchDisconnectedException

SUPPORTED_KIND = ["Pod"]


class InstanceWatcher(object):

    def __init__(self, settings, callback):
        logging.info("Initializing InstanceWatcher")

        self.watchers = dict()
        self.connected = False
        self.message = None
        self.params = dict()

        self.settings = settings
        self.callback = callback

    @coroutine
    def watch(self, message):
        logging.info("Starting watch Instance")

        self.message = message
        if self.validate_message():
            if len(self.watchers.keys()) > 0:
                self.unwatch()

            yield self.initialize_data()

            self.connected = True
            try:
                logging.debug("Starting watch Instance connected with params %s" % self.params)

                if self.params["kind"] == "Pod":
                    self._watch_pod()

            except Exception as e:
                logging.exception(e)
                if self.connected:
                    self.callback(dict(
                        action=self.message["action"],
                        operation="watched",
                        status_code=400,
                        correlation=self.message["correlation"],
                        body={"error": {"message": "Failed to connect to event source."}},
                    ))

    @coroutine
    def initialize_data(self):
        logging.info("Initializing data watch Instance with params %s" % self.params)
        items = []

        if self.params["kind"] == "Pod":
            items = yield self._initialize_pod()

        self.callback(dict(
            action=self.message["action"],
            operation="watched",
            correlation=self.message["correlation"],
            status_code=200,
            body=items
        ))

    def unwatch(self):
        logging.info("Stopping watch Instance with params %s" % self.params)
        for watcher in self.watchers.values():
            if "watcher" in watcher:
                watcher["watcher"].cancel()

        self.watchers = dict()
        self.connected = False
        self.message = None
        self.params = None

    def validate_message(self):
        if "body" not in self.message:
            self.write_message(dict(
                action=self.message["action"],
                operation=self.message["operation"],
                correlation=self.message["correlation"],
                body={"message": "Missing body in request"},
                status_code=400
            ))

            return False

        if "namespace" not in self.message["body"]:
            self.write_message(dict(
                action=self.message["action"],
                operation=self.message["operation"],
                correlation=self.message["correlation"],
                body={"message": "Missing namespace in request body"},
                status_code=400
            ))

            return False

        if "kind" not in self.message["body"]:
            self.write_message(dict(
                action=self.message["action"],
                operation=self.message["operation"],
                correlation=self.message["correlation"],
                body={"message": "Missing kind in request body"},
                status_code=400
            ))

            return False

        if "name" not in self.message["body"]:
            self.write_message(dict(
                action=self.message["action"],
                operation=self.message["operation"],
                correlation=self.message["correlation"],
                body={"message": "Missing name in request body"},
                status_code=400
            ))

            return False

        if self.message["body"]["kind"] not in SUPPORTED_KIND:
            self.write_message(dict(
                action=self.message["action"],
                operation=self.message["operation"],
                correlation=self.message["correlation"],
                body={"message": "Kind %s not supported" % self.message["body"]["kind"]},
                status_code=400
            ))

            return False

        self.params = dict(
            kind=self.message["body"]["kind"],
            namespace=self.message["body"]["namespace"],
            name=self.message["body"]["name"]
        )

        return True

    @coroutine
    def _initialize_pod(self):
        items = []

        pod = yield self.settings["kube"].pods.get(self.params["name"], namespace=self.params["namespace"])
        self.watchers[pod["kind"]] = dict(resourceVersion=pod["metadata"]["resourceVersion"])
        items.extend([pod])

        self.params["uid"] = pod["metadata"]["uid"]
        result = yield self.settings["kube"].events.filter(selector=dict(fieldSelector={
            "involvedObject.name": self.params["name"],
            "involvedObject.namespace": self.params["namespace"],
            "involvedObject.uid": self.params["uid"]
        })).get(namespace=self.params["namespace"])

        self.watchers[result["kind"]] = dict(resourceVersion=result["metadata"]["resourceVersion"])
        events = []
        for item in result.get("items", []):
            item["kind"] = result["kind"].replace("List", "")
            events.append(item)

        items.extend(events)

        raise Return(items)

    def _watch_pod(self):
        def done_callback(future):
            logging.warn("Disconnected from kubeclient.")

            if future.exception():
                logging.exception(future.exception())

            if self.connected and isinstance(future.exception(), WatchDisconnectedException):
                for watcher_key, watcher_value in self.watchers.iteritems():
                    if watcher_value["watcher"] == future:
                        if watcher_key == "Pod":
                            self.watchers["Pod"]["watcher"] = self.settings["kube"].pods.watch(
                                name=self.params["name"],
                                namespace=self.params["namespace"],
                                resource_version=self.watchers["Pod"]["resourceVersion"],
                                on_data=self._pod_data_callback
                            )

                            self.watchers["Pod"]["watcher"].add_done_callback(done_callback)
                        elif watcher_key == "EventList":
                            self.watchers["EventList"]["watcher"] = self.settings["kube"].events.filter(
                                selector=dict(fieldSelector={
                                    "involvedObject.name": self.params["name"],
                                    "involvedObject.namespace": self.params["namespace"],
                                    "involvedObject.uid": self.params["uid"]
                                })).watch(
                                on_data=self._pod_data_callback,
                                namespace=self.params["namespace"],
                                resource_version=self.watchers["EventList"]["resourceVersion"])

                            self.watchers["EventList"]["watcher"].add_done_callback(done_callback)

                        logging.debug("Reconnected watcher for %s " % watcher_key)

        self.watchers["Pod"]["watcher"] = self.settings["kube"].pods.watch(
            name=self.params["name"],
            namespace=self.params["namespace"],
            resource_version=self.watchers["Pod"]["resourceVersion"],
            on_data=self._pod_data_callback
        )

        self.watchers["Pod"]["watcher"].add_done_callback(done_callback)

        self.watchers["EventList"]["watcher"] = self.settings["kube"].events.filter(selector=dict(fieldSelector={
            "involvedObject.name": self.params["name"],
            "involvedObject.namespace": self.params["namespace"],
            "involvedObject.uid": self.params["uid"]
        })).watch(
            on_data=self._pod_data_callback,
            namespace=self.params["namespace"],
            resource_version=self.watchers["EventList"]["resourceVersion"])

        self.watchers["EventList"]["watcher"].add_done_callback(done_callback)

    @coroutine
    def _pod_data_callback(self, data):
        logging.info("InstanceWatcher _pod_data_callback")

        resource = "Pod"
        if data["object"]["kind"] == "Event":
            resource = "EventList"

        self.watchers[resource]["resourceVersion"] = data["object"]["metadata"]["resourceVersion"]

        operation = "updated"
        if data["type"] == "ADDED":
            operation = "created"
        elif data["type"] == "DELETED":
            operation = "deleted"

        response = dict(
            action=self.message["action"],
            operation=operation,
            status_code=200,
            body=data["object"]
        )

        self.callback(response)
        raise Return()

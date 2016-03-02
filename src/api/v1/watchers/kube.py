import logging

from tornado.gen import coroutine, Return

from api.kube.exceptions import WatchDisconnectedException

ACTIONS_METADATA = {
    "instances": {
        "required_params": [],
        "resources": {
            "pods": {
                "type": "PodList",
                "selector": None
            },
            "replicationcontrollers": {
                "type": "ReplicationControllerList",
                "selector": None
            },
            "services": {
                "type": "ServiceList",
                "selector": None
            }
        }
    },
    "instance": {
        "required_params": ["namespace", "kind", "name"],
        "Pod": {
            "resources": {
                "pods": {
                    "type": "Pod",
                    "selector": None
                },
                "events": {
                    "type": "EventList",
                    "selector": {
                        "involvedObject.name": "%(name)s",
                        "involvedObject.namespace": "%(namespace)s",
                        "involvedObject.uid": "%(uid)s"
                    }
                }
            }
        },
        "ReplicationController": {
            "resources": {
                "replicationcontrollers": {
                    "type": "ReplicationController",
                    "selector": None
                },
                "events": {
                    "type": "EventList",
                    "selector": {
                        "involvedObject.name": "%(name)s",
                        "involvedObject.kind": "%(kind)s",
                        "involvedObject.namespace": "%(namespace)s",
                        "involvedObject.uid": "%(uid)s"
                    }
                }
            }
        },
        "Service": {
            "resources": {
                "services": {
                    "type": "Service",
                    "selector": None
                },
                "endpoints": {
                    "type": "Endpoints",
                    "selector": None
                },
                "events": {
                    "type": "EventList",
                    "selector": {
                        "involvedObject.name": "%(name)s",
                        "involvedObject.kind": "%(kind)s",
                        "involvedObject.namespace": "%(namespace)s",
                        "involvedObject.uid": "%(uid)s"
                    }
                }
            }
        }
    }
}


class KubeWatcher(object):

    def __init__(self, message, settings, callback):
        logging.info("Initializing KubeWatcher")

        self.watchers = dict()
        self.resources_config = dict()
        self.connected = False
        self.params = dict(namespace=None, name=None)

        self.settings = settings
        self.callback = callback
        self.message = message

        self.validate_message()

    @coroutine
    def watch(self):
        def done_callback(future):
            logging.warn("Disconnected from kubeclient.")

            if future.exception():
                logging.exception(future.exception())

            if self.connected and isinstance(future.exception(), WatchDisconnectedException):
                for watcher_key, watcher_value in self.watchers.iteritems():
                    if watcher_value['watcher'] == future:
                        for name, metadata in self.resources_config.iteritems():
                            if watcher_key != metadata["type"]:
                                continue

                            self.watchers[watcher_key]['watcher'] = self.settings["kube"][name].filter(
                                self.get_selector(metadata["selector"])).watch(
                                    name=self.params["name"],
                                    namespace=self.params["namespace"],
                                    resource_version=self.watchers[watcher_key]['resourceVersion'],
                                    on_data=self.data_callback)

                            self.watchers[watcher_key]['watcher'].add_done_callback(done_callback)
                            logging.debug("Reconnected watcher for %s", watcher_key)

        logging.info("Starting watch KubeWatcher for action %s", self.message["action"])
        yield self.initialize_data()

        self.connected = True
        try:
            logging.debug("Starting watch %s connected", self.message["action"])

            for resource, resource_metadata in self.resources_config.iteritems():
                self.watchers[resource_metadata["type"]]['watcher'] = self.settings["kube"][resource].filter(
                    self.get_selector(resource_metadata["selector"])).watch(
                        name=self.params["name"],
                        namespace=self.params["namespace"],
                        resource_version=self.watchers[resource_metadata["type"]]["resourceVersion"],
                        on_data=self.data_callback)

                self.watchers[resource_metadata["type"]]['watcher'].add_done_callback(done_callback)
                logging.debug("Added watcher for %s and namespace %s",
                              resource_metadata["type"],
                              self.params["namespace"])

        except Exception as error:
            logging.exception(error)
            if self.connected:
                self.callback(dict(
                    action=self.message["action"],
                    operation="watched",
                    status_code=400,
                    correlation=self.message["correlation"],
                    body={"error": {"message": "Failed to connect to event source."}},
                ))

    @coroutine
    def data_callback(self, data):
        logging.info("InstancesWatcher data_callback")

        resource_list = data['object']['kind'] + "List"
        self.watchers[resource_list]["resourceVersion"] = data['object']['metadata']['resourceVersion']

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

    @coroutine
    def initialize_data(self):
        items = []

        for resource, resource_metadata in self.resources_config.iteritems():
            result = yield self.settings["kube"][resource].filter(self.get_selector(
                resource_metadata["selector"])).get(name=self.params["name"], namespace=self.params["namespace"])

            self.watchers[result['kind']] = dict(resourceVersion=result['metadata']['resourceVersion'])

            documents = []
            if "items" in result:
                for item in result.get("items", []):
                    item["kind"] = result["kind"].replace("List", "")
                    documents.append(item)
            else:
                self.params["uid"] = result["metadata"]["uid"]
                documents.append(result)

            items.extend(documents)

        self.callback(dict(
            action=self.message["action"],
            operation="watched",
            correlation=self.message["correlation"],
            status_code=200,
            body=items
        ))

    def unwatch(self):
        logging.info("Stopping watch %s for namespace %s", self.message["action"], self.params["namespace"])
        for watcher in self.watchers.values():
            if 'watcher' in watcher:
                watcher['watcher'].cancel()

        self.watchers = dict()
        self.connected = False

    def validate_message(self):
        for required_param in ACTIONS_METADATA[self.message["action"]]["required_params"]:
            if required_param not in self.message["body"]:
                self.callback(dict(
                    action=self.message["action"],
                    operation=self.message["operation"],
                    correlation=self.message["correlation"],
                    body={"message": "Missing %s in request body" % required_param},
                    status_code=400
                ))

                raise RuntimeError()
            else:
                self.params[required_param] = self.message["body"][required_param]

        if "kind" in self.params:
            self.resources_config = ACTIONS_METADATA[self.message["action"]][self.params["kind"]]["resources"]
        else:
            self.resources_config = ACTIONS_METADATA[self.message["action"]]["resources"]

    def get_selector(self, selector):
        if selector:
            for key, value in selector.iteritems():
                selector[key] = value % self.params

        return selector

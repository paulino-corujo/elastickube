"""
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

import copy
import logging

from tornado.gen import coroutine, Return

from api.kube.exceptions import WatchDisconnectedException
from data.query import Query


class KubeWatcher(object):

    ACTIONS_METADATA = {
        "instances": {
            "required_params": [],
            "resources": {
                "pods": {
                    "type": "PodList",
                    "arguments": ["namespace"],
                    "selector": None
                },
                "replicationcontrollers": {
                    "type": "ReplicationControllerList",
                    "arguments": ["namespace"],
                    "selector": None
                },
                "services": {
                    "type": "ServiceList",
                    "arguments": ["namespace"],
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
                        "arguments": ["namespace", "name"],
                        "selector": None
                    },
                    "events": {
                        "type": "EventList",
                        "arguments": ["namespace"],
                        "selector": {
                            "fieldSelector": {
                                "involvedObject.name": "%(name)s",
                                "involvedObject.namespace": "%(namespace)s",
                                "involvedObject.uid": "%(uid)s"

                            }
                        }
                    }
                }
            },
            "ReplicationController": {
                "resources": {
                    "replicationcontrollers": {
                        "type": "ReplicationController",
                        "arguments": ["namespace", "name"],
                        "selector": None
                    },
                    "events": {
                        "type": "EventList",
                        "arguments": ["namespace"],
                        "selector": {
                            "fieldSelector": {
                                "involvedObject.name": "%(name)s",
                                "involvedObject.kind": "%(kind)s",
                                "involvedObject.namespace": "%(namespace)s",
                                "involvedObject.uid": "%(uid)s"
                            }
                        }
                    }
                }
            },
            "Service": {
                "resources": {
                    "services": {
                        "type": "Service",
                        "arguments": ["namespace", "name"],
                        "selector": None
                    },
                    "endpoints": {
                        "type": "Endpoints",
                        "arguments": ["namespace", "name"],
                        "selector": None
                    },
                    "events": {
                        "type": "EventList",
                        "arguments": ["namespace"],
                        "selector": {
                            "fieldSelector": {
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
    }

    def __init__(self, message, settings, user, callback):
        logging.info("Initializing KubeWatcher")

        self.watchers = dict()
        self.resources_config = dict()
        self.connected = False
        self.params = dict(namespace=None, name=None)

        self.settings = settings
        self.callback = callback
        self.message = message
        self.user = user

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

                            self.watchers[watcher_key]["watcher"] = self.settings["kube"][name].filter(
                                self.get_selector(metadata["selector"])).watch(
                                    resource_version=self.watchers[watcher_key]["resourceVersion"],
                                    on_data=self.data_callback,
                                    **self.get_params(metadata["arguments"]))

                            self.watchers[watcher_key]["watcher"].add_done_callback(done_callback)
                            logging.debug("Reconnected watcher for %s", watcher_key)

        logging.info("Starting watch KubeWatcher for action %s with params %s", self.message["action"], self.params)
        yield self.initialize_data()

        self.connected = True
        try:
            logging.debug("Starting watch %s connected", self.message["action"])

            for resource, resource_metadata in self.resources_config.iteritems():
                self.watchers[resource_metadata["type"]]["watcher"] = self.settings["kube"][resource].filter(
                    self.get_selector(resource_metadata["selector"])).watch(
                        resource_version=self.watchers[resource_metadata["type"]]["resourceVersion"],
                        on_data=self.data_callback,
                        **self.get_params(resource_metadata["arguments"]))

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
        logging.debug("InstancesWatcher data_callback")

        operation = "updated"
        if data["type"] == "ADDED":
            operation = "created"
        elif data["type"] == "DELETED":
            operation = "deleted"
        elif data["type"] == "ERROR":
            logging.warn("Error raised from Kubernetes: %s", data["object"])
            raise Return()

        resource_list = data["object"]["kind"]
        if resource_list not in self.watchers.keys():
            resource_list += "List"

        self.watchers[resource_list]["resourceVersion"] = data['object']['metadata']['resourceVersion']

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
            select = self.get_selector(
                resource_metadata["selector"])

            result = yield self.settings["kube"][resource].filter(select).get(
                **self.get_params(resource_metadata["arguments"]))

            self.watchers[result['kind']] = dict(resourceVersion=result['metadata']['resourceVersion'])

            documents = []
            if "items" in result:
                for item in result.get("items", []):
                    item["kind"] = result["kind"].replace("List", "")
                    if item["kind"] == "Event":
                        logging.debug(item["message"])

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
        logging.info("Stopping watch %s with params %s", self.message["action"], self.params)
        for watcher in self.watchers.values():
            if "watcher" in watcher:
                watcher["watcher"].cancel()

        self.watchers = dict()
        self.connected = False
        self.params = dict(namespace=None, name=None)

    def validate_message(self):
        for required_param in self.ACTIONS_METADATA[self.message["action"]]["required_params"]:
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
            self.resources_config = copy.deepcopy(
                self.ACTIONS_METADATA[self.message["action"]][self.params["kind"]]["resources"])
        else:
            self.resources_config = copy.deepcopy(self.ACTIONS_METADATA[self.message["action"]]["resources"])

    @coroutine
    def check_permissions(self, operation, document):
        logging.debug("check_permissions for user %s and operation %s on kube watch", self.user["username"], operation)
        if self.user["role"] != "administrator":
            if "namespace" not in document:
                raise Return(False)

            namespace = yield Query(self.settings["database"], "Namespaces").find_one({"name": document["namespace"]})
            if self.user["username"] not in namespace["members"]:
                raise Return(False)

        raise Return(True)

    def get_params(self, arguments):
        params = dict()
        for argument in arguments:
            params[argument] = self.params[argument]

        return params

    def get_selector(self, selector):
        if selector:
            for key, selector_items in selector.iteritems():
                for selector_key, selector_value in selector_items.iteritems():
                    selector_items[selector_key] = selector_value % self.params

                selector[key] = selector_items

        return selector

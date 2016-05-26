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

import logging

from tornado.gen import coroutine, Return
from tornado.httpclient import HTTPError

from api.v1.watchers.metadata import WatcherMetadata
from data.query import Query


class KubeWatcher(object):

    def __init__(self, message, settings, user, callback):
        logging.info("Initializing KubeWatcher")

        self.settings = settings
        self.callback = callback
        self.message = message
        self.user = user

        self._metadata = None
        self._watchers = dict()
        self._params = dict()
        self._connected = False

        self._metadata = self._get_metadata()
        self._validate_message()

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

    @coroutine
    def watch(self):
        def done_callback(future):
            logging.warn("Disconnected from kubeclient.")
            if future.exception():
                logging.exception(future.exception())

            if self._connected and (isinstance(future.exception(), HTTPError) and future.exception().code == 599):
                for watcher_key, watcher_value in self._watchers.iteritems():
                    if watcher_value == future:
                        for name, metadata in watcher_metadata.get("resources", {}).iteritems():
                            if watcher_key != metadata["type"]:
                                continue

                            self._watchers[watcher_key] = getattr(
                                self.settings["kube"][name], metadata["method"].lower())(
                                    on_data=self._data_callback,
                                    **self._get_params(metadata["parameters"]))

                            self._watchers[watcher_key].add_done_callback(done_callback)
                            logging.debug("Reconnected watcher for %s with params %s", watcher_key, self._params)

        try:
            logging.info("Starting watch KubeWatcher for message %s", self.message)
            yield self._init_data()

            logging.debug("Starting watch %s connected", self.message["action"])
            watcher_metadata = self._metadata.get("watch", {})
            for resource_name, resource_metadata in watcher_metadata.get("resources", {}).iteritems():
                self._watchers[resource_metadata["type"]] = getattr(
                    self.settings["kube"][resource_name], resource_metadata["method"].lower())(
                        on_data=self._data_callback,
                        **self._get_params(resource_metadata["parameters"]))

                self._watchers[resource_metadata["type"]].add_done_callback(done_callback)
                self._connected = True
                logging.debug("Added watcher for resource %s and params %s", resource_metadata["type"], self._params)

        except HTTPError as http_error:
            logging.exception(http_error)
            self.callback(dict(
                action=self.message["action"],
                operation="watched",
                status_code=400,
                correlation=self.message["correlation"],
                body={"error": {"message": "Failed to connect to event source."}},
            ))

    def unwatch(self):
        logging.info("Stopping watch for message %s", self.message)

        if self._connected:
            for watcher in self._watchers.values():
                watcher.cancel()

    def _get_metadata(self):
        if "body" in self.message and "kind" in self.message["body"]:
            watcher_metadata = WatcherMetadata(self.message["body"]["kind"].lower())
        else:
            watcher_metadata = WatcherMetadata(self.message["action"])

        return watcher_metadata.get(self.settings)

    def _validate_message(self):
        if len(self._metadata["required_params"]) > 0 and "body" not in self.message:
            self.callback(dict(
                action=self.message["action"],
                operation=self.message["operation"],
                correlation=self.message["correlation"],
                body={"message": "Missing body in request % s" % self.message},
                status_code=400
            ))

            raise RuntimeError()

        for required_param in self._metadata["required_params"]:
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
                self._params[required_param] = self.message["body"][required_param]

    @coroutine
    def _init_data(self):
        items = []

        init_metadata = self._metadata.get("init", {})
        for _, resource_metadata in init_metadata.get("resources", {}).iteritems():
            result = yield getattr(
                self.settings["kube"][resource_metadata["resource"]],
                resource_metadata["method"].lower())(**self._get_params(resource_metadata["parameters"]))

            self._params["resourceVersion" + result["kind"]] = result["metadata"]["resourceVersion"]

            documents = []
            if "items" in result:
                for item in result.get("items", []):
                    item["kind"] = result["kind"].replace("List", "")
                    documents.append(item)
            else:
                self._params["uid"] = result["metadata"]["uid"]
                documents.append(result)

            items.extend(documents)

        self.callback(dict(
            action=self.message["action"],
            operation="watched",
            correlation=self.message["correlation"],
            status_code=200,
            body=items
        ))

    @coroutine
    def _data_callback(self, data):
        logging.debug("InstancesWatcher data_callback")

        if "type" not in data:
            logging.warn("Unexpected message from Kubernetes: %s", data)
            raise Return()

        operation = "updated"
        if data["type"] == "ADDED":
            operation = "created"
        elif data["type"] == "DELETED":
            operation = "deleted"
        elif data["type"] == "ERROR":
            logging.warn("Error raised from Kubernetes: %s", data["object"])
            raise Return()

        resource_list = data["object"]["kind"]
        if resource_list not in self._watchers.keys():
            resource_list += "List"

        self._params["resourceVersion" + resource_list] = data["object"]["metadata"]["resourceVersion"]

        response = dict(
            action=self.message["action"],
            operation=operation,
            status_code=200,
            body=data["object"]
        )

        yield self.callback(response)
        raise Return()

    def _get_params(self, arguments):
        params = dict()
        for key, value in arguments.iteritems():
            try:
                if isinstance(value, str):
                    formatted_value = str(value) % self._params
                    if formatted_value:
                        params[key] = formatted_value
                else:
                    params[key] = value
            except KeyError:
                # Skip missing parameters
                pass

        return params

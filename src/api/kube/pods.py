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

import json
import logging
import time

from tornado.gen import coroutine, Return
from tornado.httpclient import HTTPError

from api.kube.resources import NamespacedResource


class Pods(NamespacedResource):

    @coroutine
    def metrics(self, heapster_client, namespace, name, **kwargs):
        metrics = dict(kind="MetricList", items=[], metadata=dict(resourceVersion=time.time()))

        if (yield heapster_client.is_heapster_available()):
            pods = yield heapster_client.pods.get(namespace=namespace)
            if name not in pods:
                raise Return(metrics)

            node_cpu_limit = None
            node_mem_limit = None

            pod = yield self.get(namespace=namespace, name=name)
            for container in pod["spec"]["containers"]:
                cpu_limit_response = yield heapster_client.containers.metric(
                    "cpu/limit",
                    name=container["name"],
                    namespace=namespace,
                    pod_name=name,
                )

                if not cpu_limit_response:
                    continue

                cpu_limits = cpu_limit_response.get("metrics", [])
                if len(cpu_limits) == 0:
                    continue

                cpu_limit = cpu_limits[-1]["value"]
                if cpu_limit == 0:
                    if not node_cpu_limit:
                        node_cpu_limit, _ = yield self._get_node_metrics(heapster_client, pod["spec"]["nodeName"])

                    cpu_limit = node_cpu_limit

                mem_limit_response = yield heapster_client.containers.metric(
                    "memory/limit",
                    name=container["name"],
                    namespace=namespace,
                    pod_name=name,
                )

                if not mem_limit_response:
                    continue

                mem_limits = mem_limit_response.get("metrics", [])
                if len(mem_limits) == 0:
                    continue

                mem_limit = mem_limits[-1]["value"]
                if mem_limit == 0:
                    if not node_mem_limit:
                        node_cpu_limit, node_mem_limit = yield self._get_node_metrics(
                            heapster_client,
                            pod["spec"]["nodeName"])

                    mem_limit = node_mem_limit

                try:
                    cpu_usage_response = yield heapster_client.containers.metric(
                        "cpu/usage_rate",
                        name=container["name"],
                        namespace=namespace,
                        pod_name=name
                    )
                except HTTPError as http_error:
                    logging.exception(http_error)
                    continue

                cpu_usage = 0
                for metric in cpu_usage_response["metrics"]:
                    if metric["timestamp"] == cpu_usage_response["latestTimestamp"]:
                        cpu_usage = metric["value"]
                        break

                try:
                    mem_usage_response = yield heapster_client.containers.metric(
                        "memory/usage",
                        name=container["name"],
                        namespace=namespace,
                        pod_name=name

                    )
                except HTTPError as http_error:
                    logging.exception(http_error)
                    continue

                mem_usage = 0
                for metric in mem_usage_response["metrics"]:
                    if metric["timestamp"] == mem_usage_response["latestTimestamp"]:
                        mem_usage = metric["value"]
                        break

                container_metrics = dict(
                    name=container["name"],
                    cpuUsage=int(cpu_usage / float(cpu_limit) * 100),
                    memUsage=int(mem_usage / float(mem_limit) * 100)
                )

                metrics["items"].append(container_metrics)

        raise Return(metrics)

    @coroutine
    def _get_node_metrics(self, heapster_client, node_name):
        node_response = yield self.api.http_client.get("/api/v1/nodes/" + node_name)
        node = json.loads(node_response.body)

        node_cpu = int(node["status"]["capacity"]["cpu"]) * 1024
        node_mem = int(node["status"]["capacity"]["memory"].replace("Ki", ""))

        node_cpu_request = 0
        cpu_request_response = yield heapster_client.nodes.metric("cpu/request", name=node_name)
        if cpu_request_response and len(cpu_request_response.get("metrics", [])) > 0:
            node_cpu_request = cpu_request_response.get("metrics")[-1]["value"]

        node_mem_request = 0
        mem_request_response = yield heapster_client.nodes.metric("memory/request", name=node_name)
        if mem_request_response and len(mem_request_response.get("metrics", [])) > 0:
            node_mem_request = mem_request_response.get("metrics")[-1]["value"]

        raise Return((node_cpu - node_cpu_request, (node_mem - node_mem_request / 1024) * 1024))

    @coroutine
    def logs(self, namespace, name, **kwargs):
        logs = dict(kind="LogList", items=[], metadata=dict(resourceVersion=time.time()))

        pod = yield self.get(namespace=namespace, name=name)
        for container_status in pod["status"]["containerStatuses"]:
            result = yield self.log(namespace=namespace, name=name, container=container_status["name"], **kwargs)
            logs["items"].extend(result.get("items", []))

        raise Return(logs)

    @coroutine
    def log(self, **kwargs):
        url_path = self.api_path + "/namespaces/{namespace}/pods/{name}/log"
        url = self.api.http_client.build_url(url_path, **kwargs)

        params = dict(timestamps=True, container=kwargs["container"])

        for key in kwargs.iterkeys():
            if key not in url_path:
                params[key] = kwargs[key]

        logs = dict(kind="LogList", items=[], metadata=dict(resourceVersion=time.time()))
        lines = []
        try:
            result = yield self.api.http_client.request(url, **params)
            lines = result.body.splitlines()
        except HTTPError as http_error:
            logging.exception("Failed to retrieve Pods logs")

        for line in lines:
            text = line
            timestamp = None

            if params["timestamps"]:
                parsed_line = line.split(" ", 1)
                text = parsed_line[1]
                timestamp = parsed_line[0]

            logs["items"].append(dict(
                pod=kwargs["name"],
                container=kwargs["container"],
                text=text,
                timestamp=timestamp
            ))

        raise Return(logs)

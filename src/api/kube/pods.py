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
    def metrics(self, namespace, name, **kwargs):
        metrics = dict(kind="MetricList", items=[], metadata=dict(resourceVersion=time.time()))
        if self.api.heapster_base_url:
            node_cpu_limit = None
            node_mem_limit = None

            containers_url = "%s/namespaces/%s/pods/%s/containers/" % (
                self.api.heapster_base_url, namespace, name)

            try:
                containers = yield self.api.http_client.request(containers_url, **kwargs)
            except HTTPError as http_error:
                logging.exception(http_error)
                raise Return(metrics)

            for container in json.loads(containers.body):
                container_stats_url = "%s/namespaces/%s/pods/%s/containers/%s/stats" % (
                    self.api.heapster_base_url, namespace, name, container["name"])

                try:
                    container_stats_response = yield self.api.http_client.request(container_stats_url, **kwargs)
                except HTTPError as http_error:
                    logging.exception(http_error)
                    continue

                container_stats = json.loads(container_stats_response.body)["stats"]
                container_cpu_limit = container_stats["cpu-limit"]["minute"]["average"]
                if container_cpu_limit < 2:
                    if not node_cpu_limit:
                        node_cpu_limit, node_mem_limit = yield self._get_node_metrics(namespace, name)

                    container_cpu_limit = node_cpu_limit

                container_mem_limit = container_stats["memory-limit"]["minute"]["average"]
                if container_mem_limit == 0:
                    if not node_cpu_limit:
                        node_cpu_limit, node_mem_limit = yield self._get_node_metrics(namespace, name)

                    container_mem_limit = node_mem_limit

                container_metrics = dict(
                    name=container["name"],
                    cpuUsage=int(container_stats["cpu-usage"]["minute"]["average"] / float(container_cpu_limit) * 100),
                    memUsage=int(container_stats["memory-usage"]["minute"]["average"] /
                                 float(container_mem_limit) * 100)
                )

                metrics["items"].append(container_metrics)

        raise Return(metrics)

    @coroutine
    def _get_node_metrics(self, namespace, name):
        node_name = None

        nodes_url = "%s/nodes" % self.api.heapster_base_url
        nodes_response = yield self.api.http_client.request(nodes_url)
        for node in json.loads(nodes_response.body):
            node_pods_url = "%s/nodes/%s/pods" % (self.api.heapster_base_url, node["name"])
            node_pods_response = yield self.api.http_client.request(node_pods_url)
            for pod in json.loads(node_pods_response.body):
                if pod["name"] == "%s/%s/%s" % (namespace, namespace, name):
                    node_name = node["name"]
                    break

        node_metrics_url = "%s/nodes/%s/metrics" % (self.api.heapster_base_url, node_name)

        cpu_result = yield self.api.http_client.request(node_metrics_url + "/cpu-limit")
        cpu_metrics = json.loads(cpu_result.body).get("metrics")

        mem_result = yield self.api.http_client.request(node_metrics_url + "/memory-limit")
        mem_metrics = json.loads(mem_result.body).get("metrics")

        raise Return((cpu_metrics[0]["value"], mem_metrics[0]["value"]))

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

        result = yield self.api.http_client.request(url, **params)

        logs = dict(kind="LogList", items=[], metadata=dict(resourceVersion=time.time()))

        lines = result.body.splitlines()
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

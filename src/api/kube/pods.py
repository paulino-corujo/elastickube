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

from tornado.gen import coroutine, Return
from tornado.httpclient import HTTPError

from api.kube.resources import NamespacedResource


class Pods(NamespacedResource):

    @coroutine
    def get(self, name=None, namespace=None):
        result = yield super(Pods, self).get(name=name, namespace=namespace)

        if self.api.heapster_base_url and name:
            node_cpu_limit = None
            node_mem_limit = None
            for container in result["spec"]["containers"]:
                if "limits" not in container["resources"]:
                    if not node_cpu_limit:
                        node_cpu_limit, node_mem_limit = yield self._get_node_metrics(result["status"]["hostIP"])

                    container_cpu_limit = node_cpu_limit
                    container_mem_limit = node_mem_limit
                else:
                    if (("cpu" not in container["resources"]["limits"] or
                         "memory" not in container["resources"]["limits"]) and not node_cpu_limit):
                        node_cpu_limit, node_mem_limit = yield self._get_node_metrics(result["status"]["hostIP"])

                    if "cpu" in container["resources"]["limits"]:
                        container_cpu_limit = int(container["resources"]["limits"]["cpu"].replace("m", ""))
                    else:
                        container_cpu_limit = node_cpu_limit

                    if "memory" in container["resources"]["limits"]:
                        container_mem_limit = (int(container["resources"]["limits"]["memory"].replace("Mi", "")) *
                                               pow(10, 6))
                    else:
                        container_mem_limit = node_mem_limit

                url_cpu_usage = "%s/namespaces/%s/pods/%s/containers/%s/metrics/cpu-usage" % (
                    self.api.heapster_base_url, namespace, name, container["name"])

                try:
                    cpu_result = yield self.api.http_client.request(url_cpu_usage)
                except HTTPError as http_error:
                    logging.exception(http_error)
                    continue

                cpu_metrics = json.loads(cpu_result.body).get("metrics")
                container_cpu_usage = cpu_metrics[0]["value"]

                url_mem_usage = "%s/namespaces/%s/pods/%s/containers/%s/metrics/memory-usage" % (
                    self.api.heapster_base_url, namespace, name, container["name"])

                try:
                    mem_result = yield self.api.http_client.request(url_mem_usage)
                except HTTPError as http_error:
                    logging.exception(http_error)
                    continue

                mem_metrics = json.loads(mem_result.body).get("metrics")
                container_mem_usage = mem_metrics[0]["value"]

                container["metrics"] = dict(cpuUsage=int(container_cpu_usage / float(container_cpu_limit) * 100),
                                            memUsage=int(container_mem_usage / float(container_mem_limit) * 100))

        raise Return(result)

    @coroutine
    def _get_node_metrics(self, host_ip):
        node_metrics_url = "%s/nodes/%s/metrics" % (self.api.heapster_base_url, host_ip)

        cpu_result = yield self.api.http_client.request(node_metrics_url + "/cpu-limit")
        cpu_metrics = json.loads(cpu_result.body).get("metrics")

        mem_result = yield self.api.http_client.request(node_metrics_url + "/memory-limit")
        mem_metrics = json.loads(mem_result.body).get("metrics")

        raise Return((cpu_metrics[0]["value"], mem_metrics[0]["value"]))

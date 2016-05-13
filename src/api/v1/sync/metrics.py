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
from tornado import ioloop

from data.query import Query


class SyncMetrics(object):

    def __init__(self, settings):
        logging.info("Initializing SyncMetrics")
        self.settings = settings

    @coroutine
    def start_sync(self):
        @coroutine
        def sync_metrics():
            heapster_namespaces = yield self.settings["heapster"].namespaces.get()
            if len(heapster_namespaces) > 0:
                kube_namespaces = yield self.settings["kube"].namespaces.get()

                # We are assuming that the cluster has a constant capacity over the period
                cluster_cpu_capacity, cluster_mem_capacity = yield self._get_cluster_capacity()

                metrics = []
                for namespace in heapster_namespaces:
                    namespace_uid = None
                    for existing_namespace in kube_namespaces.get("items", []):
                        if existing_namespace["metadata"]["name"] == namespace:
                            namespace_uid = existing_namespace["metadata"]["uid"]
                            break

                    namespace_metrics = yield self._get_all_metrics(namespace)
                    metrics.append(dict(name=namespace, uid=namespace_uid, results=namespace_metrics))

                for metric in metrics:
                    for timestamp, results in metric["results"]["timestamps"].iteritems():
                        usage = dict()

                        others_ns_cpu = 0
                        others_ns_mem = 0
                        for cpu_metric in metrics:
                            if cpu_metric["uid"] != metric["uid"]:
                                for cpu_timestamp, cpu_results in cpu_metric["results"]["timestamps"].iteritems():
                                    if cpu_timestamp == timestamp:
                                        others_ns_cpu += max(cpu_results["cpu_request"],
                                                             cpu_results["cpu_usage"])
                                        others_ns_mem += max(cpu_results["mem_request"],
                                                             cpu_results["mem_usage"])

                        usage["cpu_ratio"] = float(results["cpu_usage"]) / (cluster_cpu_capacity - others_ns_cpu) * 100
                        usage["mem_ratio"] = float(results["mem_usage"]) / (cluster_mem_capacity - others_ns_mem) * 100

                        data = self._build_base_metric(metric["name"], metric["uid"], timestamp, usage)
                        yield Query(self.settings["database"], "Metrics").insert(data)

        logging.info("start_sync SyncMetrics")

        if not (yield self.settings["heapster"].is_heapster_available()):
            logging.info("Heapster not available, stopping SyncMetrics.start_sync()")
            raise Return()

        periodic_callback = ioloop.PeriodicCallback(sync_metrics, 60000 * 3)
        periodic_callback.start()

    @coroutine
    def _get_all_metrics(self, namespace_name):
        metric = dict(namespace=namespace_name, timestamps=dict())

        namespace_metrics = yield self.settings["heapster"].namespaces.metrics(namespace_name)
        if "cpu/request" in namespace_metrics:
            cpu_limit_response = yield self.settings["heapster"].namespaces.metric("cpu/request", name=namespace_name)
            cpu_limits = cpu_limit_response.get("metrics", [])
            timestamps = [value["timestamp"] for value in cpu_limits]

            for timestamp in timestamps:
                for item in cpu_limits:
                    if item["timestamp"] == timestamp:
                        if metric["timestamps"].keys() == 0:
                            metric["timestamps"] = {timestamp: {"cpu_request": item["value"]}}
                        else:
                            metric["timestamps"].update({timestamp: {"cpu_request": item["value"]}})

        if "memory/request" in namespace_metrics:
            mem_limit_response = yield self.settings["heapster"].namespaces.metric("memory/request",
                                                                                   name=namespace_name)
            mem_limits = mem_limit_response.get("metrics", [])
            for timestamp in metric["timestamps"].keys():
                for item in mem_limits:
                    if item["timestamp"] == timestamp:
                        metric["timestamps"][timestamp].update({"mem_request": item["value"]})

        if "cpu/usage_rate" in namespace_metrics:
            cpu_usage_response = yield self.settings["heapster"].namespaces.metric(
                "cpu/usage_rate", name=namespace_name)
            cpu_usages = cpu_usage_response.get("metrics", [])
            for timestamp in metric["timestamps"].keys():
                for item in cpu_usages:
                    if item["timestamp"] == timestamp:
                        metric["timestamps"][timestamp].update({"cpu_usage": item["value"]})

        if "memory/usage" in namespace_metrics:
            mem_usage_response = yield self.settings["heapster"].namespaces.metric("memory/usage", name=namespace_name)
            mem_usages = mem_usage_response.get("metrics", [])
            for timestamp in metric["timestamps"].keys():
                for item in mem_usages:
                    if item["timestamp"] == timestamp:
                        metric["timestamps"][timestamp].update({"mem_usage": item["value"]})

        raise Return(metric)

    @staticmethod
    def _build_base_metric(name, uid, timestamp, data):
        return dict(
            kind="Metric",
            involvedObject=dict(
                name=name,
                kind="Namespace",
                uid=uid
            ),
            timestamp=timestamp,
            data=data
        )

    @coroutine
    def _get_cluster_capacity(self):
        memory_capacity_in_bytes = 0
        cpu_capacity_in_milli = 0

        nodes_response = yield self.settings["kube"].nodes.get()
        for node in nodes_response.get("items", []):
            cpu_capacity_in_milli += int(node["status"]["allocatable"]["cpu"]) * 1024
            memory_capacity_in_bytes += int(node["status"]["allocatable"]["memory"].replace("Ki", "")) * 1024

        raise Return((cpu_capacity_in_milli, memory_capacity_in_bytes))

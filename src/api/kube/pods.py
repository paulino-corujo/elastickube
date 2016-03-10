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
import os

from tornado.gen import coroutine, Return

from api.kube.resources import NamespacedResource


class Pods(NamespacedResource):

    @coroutine
    def get(self, name=None, namespace=None):
        result = yield super(Pods, self).get(name=name, namespace=namespace)

        if "HEAPSTER_SERVICE_HOST" in os.environ and name:
            heapster_endpoint = os.getenv("HEAPSTER_SERVICE_HOST")
            heapster_port = os.getenv("HEAPSTER_SERVICE_PORT")
            url = "http://%s:%s/api/v1/model/namespaces/%s/pods/%s/containers" % (
                heapster_endpoint, heapster_port, namespace, name
            )

            response = yield self.api.http_client.request(url)
            metrics = json.loads(response.body)
            for metric in metrics:
                for container in result["spec"]["containers"]:
                    if container["name"] == metric["name"]:
                        container["metrics"] = dict(cpuUsage=metric["cpuUsage"], memUsage=metric["memUsage"])
                        break

        raise Return(result)

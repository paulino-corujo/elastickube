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
from tornado.httpclient import AsyncHTTPClient
from tornado.httputil import url_concat

from api.heapster.metrics import Metric

AsyncHTTPClient.configure("tornado.curl_httpclient.CurlAsyncHTTPClient")


class HeapsterClient(object):

    METRICS_METADATA = {
        "cluster": "",
        "nodes": "nodes",
        "namespaces": "namespaces/",
        "pods": "namespaces/{namespace}/pods/",
        "containers": "namespaces/{namespace}/pods/{pod_name}/containers/"
    }

    def __init__(self, endpoint):
        self.endpoint = endpoint
        self.metrics = {}

        self.build_metrics()

    def __getitem__(self, item):
        return getattr(self, item)

    def __getattr__(self, item):
        return self.metrics[item]

    @staticmethod
    def build_params(url, **kwargs):
        keys = kwargs.keys()
        for key in keys:
            if key in url:
                kwargs.pop(key)

        return kwargs

    def build_url(self, url_path, **kwargs):
        if url_path.startswith("/"):
            url = self.endpoint + url_path
        else:
            url = self.endpoint + "/" + url_path

        params = dict()
        for kwarg in kwargs.iterkeys():
            if kwarg in url_path:
                params[kwarg] = kwargs[kwarg]

        return url.format(**params)

    def build_metrics(self):
        logging.debug("Building available metrics")

        for metric_entity, metric_path in self.METRICS_METADATA.iteritems():
            self.metrics[metric_entity] = Metric(self, metric_path)

    @coroutine
    def is_heapster_available(self):
        client = AsyncHTTPClient(force_instance=True)
        try:
            result = yield client.fetch(self.endpoint + "/metrics", method="GET", raise_error=False)
            raise Return(not result.error)
        finally:
            client.close()

    @coroutine
    def get(self, url_path, raise_error=True, **kwargs):
        params = self.build_params(url_path, **kwargs)
        url = url_concat(self.build_url(url_path, **kwargs), params)

        client = AsyncHTTPClient(force_instance=True)
        try:
            response = yield client.fetch(url, method="GET", raise_error=raise_error)
            raise Return(response)
        finally:
            client.close()

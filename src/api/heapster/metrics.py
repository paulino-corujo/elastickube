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


class Metric(object):

    def __init__(self, api, metric_path):
        self.api = api
        self.metric_path = metric_path

    @coroutine
    def get(self, **kwargs):
        url_path = self.metric_path

        params = dict()
        for key in kwargs.iterkeys():
            params[key] = kwargs[key]

        response = yield self.api.get(url_path, **params)
        raise Return(json.loads(response.body))

    @coroutine
    def metrics(self, name=None, **kwargs):
        url_path = self.metric_path
        if name:
            url_path += "/" + name

        url_path += "/metrics/"

        params = dict()
        for key in kwargs.iterkeys():
            params[key] = kwargs[key]

        response = yield self.api.get(url_path, **params)
        raise Return(json.loads(response.body))

    @coroutine
    def metric(self, metric_name, name=None, raise_on_404=False, **kwargs):
        url_path = self.metric_path
        if name:
            url_path += "/" + name

        url_path += "/metrics/" + metric_name

        params = dict()
        for key in kwargs.iterkeys():
            params[key] = kwargs[key]

        response = yield self.api.get(url_path, raise_error=False, **params)
        if response.error:
            if response.error.code == 404 and not raise_on_404:
                logging.warning("%s GET %s", response.error.message, response.effective_url)
                raise Return(None)

            raise response.error

        raise Return(json.loads(response.body))

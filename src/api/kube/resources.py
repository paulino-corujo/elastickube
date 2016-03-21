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

from tornado.gen import coroutine, Return


class Resource(object):

    def __init__(self, api, api_path, resource_path):
        self.api = api

        self.api_path = api_path if api_path.startswith("/") else "/%s" % api_path
        if self.api_path.endswith("/") and resource_path.startswith("/"):
            self.resource_path = resource_path[1:]
        else:
            self.resource_path = resource_path if resource_path.startswith("/") else "/%s" % resource_path

        self.base_url_path = self.api_path + self.resource_path
        self.selector = {}

    @coroutine
    def get(self, **kwargs):
        url_path = self.base_url_path

        params = dict()
        if "name" in kwargs:
            url_path += "/{name}"
            params["name"] = kwargs.pop("name")

        for key in kwargs.iterkeys():
            params[key] = kwargs[key]

        result = yield self.api.get(url_path, **params)
        raise Return(result)

    @coroutine
    def delete(self, name):
        result = yield self.api.delete(self.base_url_path + "/{name}", **dict(name=name))
        raise Return(result)

    @coroutine
    def post(self, resource):
        result = yield self.api.post(self.base_url_path, **dict(body=json.dumps(resource)))
        raise Return(result)

    @coroutine
    def put(self, name, resource):
        result = yield self.api.put(self.base_url_path + "/{name}", **dict(name=name, body=json.dumps(resource)))
        raise Return(result)

    @coroutine
    def patch(self, name, partial):
        result = yield self.api.patch(self.base_url_path + "/{name}", **dict(name=name, body=json.dumps(partial)))
        raise Return(result)

    @coroutine
    def watch(self, on_data=None, **kwargs):
        url_path = self.api_path + "/watch" + self.resource_path
        params = dict()

        if "name" in kwargs:
            url_path += "/{name}"
            params["name"] = kwargs.pop("name")

        for key in kwargs.iterkeys():
            params[key] = kwargs[key]

        yield self.api.watch(url_path, on_data, **params)


class NamespacedResource(object):

    def __init__(self, api, api_path, resource_path):
        self.api = api

        self.api_path = api_path if api_path.startswith("/") else "/%s" % api_path
        if self.api_path.endswith("/") and resource_path.startswith("/"):
            self.resource_path = resource_path[1:]
        else:
            self.resource_path = resource_path if resource_path.startswith("/") else "/%s" % resource_path

        self.selector = {}

    @coroutine
    def get(self, **kwargs):
        url_path = self.api_path

        params = dict()
        if "namespace" in kwargs:
            url_path += "/namespaces/{namespace}"
            params["namespace"] = kwargs.pop("namespace")

        url_path += self.resource_path
        if "name" in kwargs:
            url_path += "/{name}"
            params["name"] = kwargs.pop("name")

        for key in kwargs.iterkeys():
            params[key] = kwargs[key]

        result = yield self.api.get(url_path, **params)
        raise Return(result)

    @coroutine
    def delete(self, name, namespace):
        url_path = self.api_path + "/namespaces/{namespace}" + self.resource_path + "/{name}"
        params = dict(namespace=namespace, name=name)

        result = yield self.api.delete(url_path, **params)
        raise Return(result)

    @coroutine
    def post(self, resource, namespace):
        url_path = self.api_path + "/namespaces/{namespace}" + self.resource_path
        params = dict(namespace=namespace, body=json.dumps(resource))

        result = yield self.api.post(url_path, **params)
        raise Return(result)

    @coroutine
    def put(self, name, resource, namespace):
        url_path = self.api_path + "/namespaces/{namespace}" + self.resource_path + "/{name}"
        params = dict(namespace=namespace, name=name, body=json.dumps(resource))

        result = yield self.api.put(url_path, **params)
        raise Return(result)

    @coroutine
    def patch(self, name, partial, namespace):
        url_path = self.api_path + "/namespaces/{namespace}" + self.resource_path + "/{name}"
        params = dict(namespace=namespace, name=name, body=json.dumps(partial))

        result = yield self.api.patch(url_path, **params)
        raise Return(result)

    def watch(self, on_data=None, **kwargs):
        url_path = self.api_path + "/watch"
        params = dict()

        if "namespace" in kwargs:
            url_path += "/namespaces/{namespace}"
            params["namespace"] = kwargs.pop("namespace")

        url_path += self.resource_path

        if "name" in kwargs:
            url_path += "/{name}"
            params["name"] = kwargs.pop("name")

        for key in kwargs.iterkeys():
            params[key] = kwargs[key]

        return self.api.watch(url_path, on_data, **params)

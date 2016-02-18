"""
ElasticBox Confidential
Copyright (c) 2016 All Right Reserved, ElasticBox Inc.

NOTICE:  All information contained herein is, and remains the property
of ElasticBox. The intellectual and technical concepts contained herein are
proprietary and may be covered by U.S. and Foreign Patents, patents in process,
and are protected by trade secret or copyright law. Dissemination of this
information or reproduction of this material is strictly forbidden unless prior
written permission is obtained from ElasticBox
"""

import json

from tornado.gen import coroutine, Return


class Resources(object):

    def __init__(self, api, base_url_path):
        self.api = api

        if base_url_path.startswith('/'):
            self.base_url_path = base_url_path
        else:
            self.base_url_path = '/' + base_url_path

        self.selector = {}

    @coroutine
    def get(self, name=None, namespace='default'):
        url_path = self.base_url_path
        params = dict(namespace=namespace)

        if name:
            url_path += '/{name}'
            params['name'] = name

        if self.selector:
            params['labelSelector'] = ''
            for k, v in self.selector.iteritems():
                params['labelSelector'] = params['labelSelector'] + k + '=' + v

        result = yield self.api.get(url_path, **params)
        raise Return(result)

    @coroutine
    def delete(self, name, namespace='default'):
        url_path = self.base_url_path + '/{name}'
        params = dict(namespace=namespace, name=name)

        result = yield self.api.delete(url_path, **params)
        raise Return(result)

    @coroutine
    def post(self, resource, namespace='default'):
        url_path = self.base_url_path
        params = dict(namespace=namespace, body=json.dumps(resource))

        result = yield self.api.post(url_path, **params)
        raise Return(result)

    @coroutine
    def put(self, name, resource, namespace='default'):
        url_path = self.base_url_path + '/{name}'
        params = dict(namespace=namespace, name=name, body=json.dumps(resource))

        result = yield self.api.put(url_path, **params)
        raise Return(result)

    @coroutine
    def patch(self, name, partial, namespace='default'):
        url_path = self.base_url_path + '/{name}'
        params = dict(namespace=namespace, name=name, body=json.dumps(partial))

        result = yield self.api.patch(url_path, **params)
        raise Return(result)

    @coroutine
    def watch(self, name=None, namespace='default', on_data=None, resource_version=None):
        params = dict(namespace=namespace)

        if resource_version:
            params['resourceVersion'] = resource_version
        else:
            response = yield self.get(name=name, namespace=namespace)

            for item in response.get('items', []):
                on_data(item)
                params['resourceVersion'] = response['metadata']['resourceVersion']

        url_path = '/watch' + self.base_url_path
        if name:
            url_path += '/{name}'
            params['name'] = name

        if self.selector:
            params['labelSelector'] = ''
            for k, v in self.selector.iteritems():
                params['labelSelector'] = params['labelSelector'] + k + '=' + v

        yield self.api.watch(url_path, on_data, **params)

    def filter(self, selector=None):
        if selector is not None:
            for k, v in selector.iteritems():
                self.selector[k] = v

        return self

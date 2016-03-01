import json

from tornado.gen import coroutine, Return


class Resource(object):

    def __init__(self, api, base_url_path):
        self.api = api

        if base_url_path.startswith('/'):
            self.base_url_path = base_url_path
        else:
            self.base_url_path = '/' + base_url_path

        self.selector = {}

    @coroutine
    def get(self, name=None):
        url_path = self.base_url_path

        params = dict()
        if name:
            url_path += '/{name}'
            params['name'] = name

        if self.selector:
            for selector, selector_values in self.selector.iteritems():
                params[selector] = ''
                for index, (key, value) in enumerate(selector_values.iteritems()):
                    if index == 0:
                        params[selector] = '%s=%s' % (key, value)
                    else:
                        params[selector] += ',%s=%s' % (key, value)

        result = yield self.api.get(url_path, **params)
        raise Return(result)

    @coroutine
    def delete(self, name):
        result = yield self.api.delete(self.base_url_path + '/{name}', **dict(name=name))
        raise Return(result)

    @coroutine
    def post(self, resource):
        result = yield self.api.post(self.base_url_path, **dict(body=json.dumps(resource)))
        raise Return(result)

    @coroutine
    def put(self, name, resource):
        result = yield self.api.put(self.base_url_path + '/{name}', **dict(name=name, body=json.dumps(resource)))
        raise Return(result)

    @coroutine
    def patch(self, name, partial):
        result = yield self.api.patch(self.base_url_path + '/{name}', **dict(name=name, body=json.dumps(partial)))
        raise Return(result)

    @coroutine
    def watch(self, name=None, resource_version=None, on_data=None):
        url_path = '/watch' + self.base_url_path
        params = dict(resourceVersion=resource_version)

        if name:
            url_path += '/{name}'
            params['name'] = name

        if self.selector:
            for selector, selector_values in self.selector.iteritems():
                params[selector] = ''
                for index, (key, value) in enumerate(selector_values.iteritems()):
                    if index == 0:
                        params[selector] = '%s=%s' % (key, value)
                    else:
                        params[selector] += ',%s=%s' % (key, value)

        yield self.api.watch(url_path, on_data, **params)

    def filter(self, selector=None):
        if selector is not None:
            for k, v in selector.iteritems():
                self.selector[k] = v

        return self


class NamespacedResource(object):

    def __init__(self, api, base_url_path):
        self.api = api

        if base_url_path.startswith('/'):
            self.base_url_path = base_url_path
        else:
            self.base_url_path = '/' + base_url_path

        self.selector = {}

    @coroutine
    def get(self, name=None, namespace=None):
        url_path = ''

        params = dict()
        if namespace:
            url_path += '/namespaces/{namespace}'
            params['namespace'] = namespace

        url_path += self.base_url_path
        if name:
            url_path += '/{name}'
            params['name'] = name

        if self.selector:
            for selector, selector_values in self.selector.iteritems():
                params[selector] = ''
                for index, (key, value) in enumerate(selector_values.iteritems()):
                    if index == 0:
                        params[selector] = '%s=%s' % (key, value)
                    else:
                        params[selector] += ',%s=%s' % (key, value)

        result = yield self.api.get(url_path, **params)
        raise Return(result)

    @coroutine
    def delete(self, name, namespace='default'):
        url_path = '/namespaces/{namespace}' + self.base_url_path + '/{name}'
        params = dict(namespace=namespace, name=name)

        result = yield self.api.delete(url_path, **params)
        raise Return(result)

    @coroutine
    def post(self, resource, namespace='default'):
        url_path = '/namespaces/{namespace}' + self.base_url_path
        params = dict(namespace=namespace, body=json.dumps(resource))

        result = yield self.api.post(url_path, **params)
        raise Return(result)

    @coroutine
    def put(self, name, resource, namespace='default'):
        url_path = '/namespaces/{namespace}' + self.base_url_path + '/{name}'
        params = dict(namespace=namespace, name=name, body=json.dumps(resource))

        result = yield self.api.put(url_path, **params)
        raise Return(result)

    @coroutine
    def patch(self, name, partial, namespace='default'):
        url_path = '/namespaces/{namespace}' + self.base_url_path + '/{name}'
        params = dict(namespace=namespace, name=name, body=json.dumps(partial))

        result = yield self.api.patch(url_path, **params)
        raise Return(result)

    @coroutine
    def watch(self, name=None, namespace=None, resource_version=None, on_data=None):
        url_path = '/watch'
        params = dict(resourceVersion=resource_version)

        if namespace:
            url_path += '/namespaces/{namespace}'
            params['namespace'] = namespace

        url_path += self.base_url_path

        if name:
            url_path += '/{name}'
            params['name'] = name

        if self.selector:
            for selector, selector_values in self.selector.iteritems():
                params[selector] = ''
                for index, (key, value) in enumerate(selector_values.iteritems()):
                    if index == 0:
                        params[selector] = '%s=%s' % (key, value)
                    else:
                        params[selector] += ',%s=%s' % (key, value)

        yield self.api.watch(url_path, on_data, **params)

    def filter(self, selector=None):
        if selector is not None:
            for k, v in selector.iteritems():
                self.selector[k] = v

        return self

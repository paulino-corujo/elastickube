import json
import logging

from tornado.gen import coroutine, Return
from tornado.concurrent import Future, chain_future
from tornado.httpclient import AsyncHTTPClient, HTTPError, HTTPRequest
from tornado.httputil import url_concat

from api.kube.exceptions import KubernetesException, WatchDisconnectedException, ResourceNotFoundException
from api.kube.resources import Resource, NamespacedResource


class HTTPClient(object):

    def __init__(self, server, token, version='v1'):
        self.server = server
        self.token = token
        self.version = version

        self._base_url = "https://{0}/api/{1}".format(self.server, self.version)
        AsyncHTTPClient.configure("tornado.curl_httpclient.CurlAsyncHTTPClient", defaults=dict(validate_cert=False))

    def build_url(self, url_path, **kwargs):
        if url_path.startswith("/"):
            url = self._base_url + url_path
        else:
            url = self._base_url + "/" + url_path

        params = {
            "namespace": kwargs.pop("namespace", "default")
        }

        for param in kwargs.iterkeys():
            if param in url_path:
                params[param] = kwargs[param]

        return url.format(**params)

    def build_params(self, url_path, **kwargs):
        if url_path.startswith("/"):
            url = self._base_url + url_path
        else:
            url = self._base_url + "/" + url_path

        keys = kwargs.keys()
        for key in keys:
            if key in url:
                kwargs.pop(key)

        return kwargs

    def build_headers(self, content_type=None):
        headers = {"Authorization": "Bearer %s" % self.token}
        if content_type:
            headers["Content-type"] = content_type

        return headers

    @coroutine
    def get(self, url_path, **kwargs):
        params = self.build_params(url_path, **kwargs)
        url = url_concat(self.build_url(url_path, **kwargs), params)

        client = AsyncHTTPClient()
        try:
            result = yield client.fetch(url, method="GET", headers=self.build_headers())
            raise Return(result)
        finally:
            client.close()

    @coroutine
    def post(self, url_path, **kwargs):
        url = self.build_url(url_path, **kwargs)
        params = self.build_params(url_path, **kwargs)

        client = AsyncHTTPClient()
        try:
            result = yield client.fetch(
                url,
                method="POST",
                headers=self.build_headers("application/json"),
                **params)

            raise Return(result)
        finally:
            client.close()

    @coroutine
    def put(self, url_path, **kwargs):
        url = self.build_url(url_path, **kwargs)
        params = self.build_params(url_path, **kwargs)

        client = AsyncHTTPClient()
        try:
            result = yield client.fetch(
                url,
                method="PUT",
                headers=self.build_headers("application/json"),
                **params)

            raise Return(result)
        finally:
            client.close()

    @coroutine
    def delete(self, url_path, **kwargs):
        client = AsyncHTTPClient()
        try:
            response = yield client.fetch(
                self.build_url(url_path, **kwargs),
                method="DELETE",
                headers=self.build_headers())
            raise Return(response)
        finally:
            client.close()

    @coroutine
    def patch(self, url_path, **kwargs):
        url = self.build_url(url_path, **kwargs)
        params = self.build_params(url_path, **kwargs)

        client = AsyncHTTPClient()
        try:
            result = yield client.fetch(
                url,
                method="PATCH",
                headers=self.build_headers("application/merge-patch+json"),
                **params)

            raise Return(result)
        finally:
            client.close()

    @coroutine
    def watch(self, url_path, on_data, **kwargs):
        class WatchFuture(Future):

            def cancel(self):
                client.close()
                logging.debug("Closing http connection")

        def data_callback(data):
            on_data(json.loads(data))

        params = self.build_params(url_path, **kwargs)
        url = url_concat(self.build_url(url_path, **kwargs), params)

        request = HTTPRequest(
            url=url,
            method="GET",
            headers=self.build_headers(),
            request_timeout=3600,
            streaming_callback=data_callback)

        client = AsyncHTTPClient()
        future = WatchFuture()

        chain_future(client.fetch(request), future)
        yield future


class KubeClient(object):

    # Cannot be generated from the API
    RESOURCE_TO_KIND_MAPPING = {
        "bindings": "Binding",
        "componentstatuses": "ComponentStatus",
        "endpoints": "Endpoints",
        "events": "Event",
        "limitranges": "LimitRange",
        "namespaces": "Namespace",
        "nodes": "Node",
        "persistentvolumeclaims": "PersistentVolumeClaim",
        "persistentvolumes": "PersistentVolume",
        "pods": "Pod",
        "podtemplates": "PodTemplate",
        "replicationcontrollers": "ReplicationController",
        "resourcequotas": "ResourceQuota",
        "secrets": "Secret",
        "serviceaccounts": "ServiceAccount",
        "services": "Service"
    }

    def __init__(self, endpoint, token=None, version='v1'):
        self.version = version
        self.http_client = HTTPClient(endpoint, token)
        self.resources = {}
        self.kind_to_resource = {}

    def __getitem__(self, item):
        return getattr(self, item)

    def __getattr__(self, item):
        return self.resources[item]

    @coroutine
    def build_resources(self):
        response = yield self.http_client.get("/")
        for resource in json.loads(response.body).get("resources", []):
            # FIXME: Also build methods endpoint
            if "/" in resource["name"]:
                continue

            if resource["name"] in self.RESOURCE_TO_KIND_MAPPING.keys():
                self.kind_to_resource[self.RESOURCE_TO_KIND_MAPPING[resource["name"]]] = resource["name"]

            if resource["namespaced"]:
                self.resources[resource["name"]] = NamespacedResource(self, resource["name"])
            else:
                self.resources[resource["name"]] = Resource(self, resource["name"])

        raise Return()

    def get_resource_type(self, kind):
        if kind not in self.kind_to_resource.keys():
            raise ResourceNotFoundException("Resource %s not found." % kind)

        return self.kind_to_resource[kind]

    @staticmethod
    def format_error(error):
        if error.code != 599:
            error_message = error.response.body
            error_method = error.response.request.method
            error_url = error.response.effective_url

            if error_message:
                return "{0} {1} returned {2}: {3}".format(error_method, error_url, error.code, error_message)
            else:
                return "{0} {1} returned {2}".format(error_method, error_url, error.code)
        else:
            return error.message

    @coroutine
    def get(self, url_path, **kwargs):
        try:
            response = yield self.http_client.get(url_path, **kwargs)
        except HTTPError as http_error:
            message = self.format_error(http_error)
            logging.exception(http_error)
            if http_error.code == 404:
                raise ResourceNotFoundException(message)
            else:
                raise KubernetesException(message, http_error.code)

        raise Return(json.loads(response.body))

    @coroutine
    def put(self, url_path, **kwargs):
        try:
            response = yield self.http_client.put(url_path, **kwargs)
        except HTTPError as http_error:
            message = self.format_error(http_error)

            if http_error.code == 404:
                raise ResourceNotFoundException(message)
            else:
                raise KubernetesException(message, http_error.code)

        raise Return(json.loads(response.body))

    @coroutine
    def post(self, url_path, **kwargs):
        try:
            response = yield self.http_client.post(url_path, **kwargs)
        except HTTPError as http_error:
            raise KubernetesException(self.format_error(http_error), http_error.code)

        raise Return(json.loads(response.body))

    @coroutine
    def delete(self, url_path, **kwargs):
        try:
            response = yield self.http_client.delete(url_path, **kwargs)
        except HTTPError as http_error:
            message = self.format_error(http_error)

            if http_error.code == 404:
                raise ResourceNotFoundException(message)
            else:
                raise KubernetesException(message, http_error.code)

        raise Return(json.loads(response.body))

    @coroutine
    def patch(self, url_path, **kwargs):
        try:
            response = yield self.http_client.patch(url_path, **kwargs)
        except HTTPError as http_error:
            message = self.format_error(http_error)

            if http_error.code == 404:
                raise ResourceNotFoundException(message)
            else:
                raise KubernetesException(message, http_error.code)

        raise Return(json.loads(response.body))

    @coroutine
    def watch(self, url_path, on_data, **kwargs):
        try:
            yield self.http_client.watch(url_path, on_data, **kwargs)
        except HTTPError as http_error:
            message = self.format_error(http_error)

            if http_error.code == 404:
                raise ResourceNotFoundException(message)
            elif http_error.code == 599:
                raise WatchDisconnectedException(message)
            else:
                raise KubernetesException(message, http_error.code)

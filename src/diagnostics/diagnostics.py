"""
# Copyright 2016 ElasticBox All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""

from __future__ import absolute_import, unicode_literals

import copy
import json
import logging
import os
import time

import tornado
import tornado.httpclient
import tornado.httpserver
import tornado.netutil
import tornado.web
from tornado.gen import Return, coroutine, sleep
from tornado.httpclient import AsyncHTTPClient
from tornado.ioloop import IOLoop


LOGGER = logging.getLogger(__name__)


@coroutine
def _check_heapster_status(settings):
    if "HEAPSTER_SERVICE_HOST" in settings:
        heapster_endpoint = settings["HEAPSTER_SERVICE_HOST"]
        heapster_port = settings["HEAPSTER_SERVICE_PORT"]
        endpoint = "http://%s:%s/api/v1/model" % (heapster_endpoint, heapster_port)
        headers = dict()
    else:
        kubernetes_endpoint = settings["KUBERNETES_SERVICE_HOST"]
        if not kubernetes_endpoint.startswith("http"):
            kubernetes_endpoint = "https://%s:%s" % (kubernetes_endpoint, settings["KUBERNETES_SERVICE_PORT"])

        endpoint = "%s%s" % (
            kubernetes_endpoint,
            "/api/v1/proxy/namespaces/kube-system/services/heapster/api/v1/model"
        )

        headers = dict(Authorization="Bearer %s" % settings['token'])

    client = AsyncHTTPClient(force_instance=True)
    try:
        result = yield client.fetch(
            endpoint + "/metrics",
            method="GET",
            validate_cert=False,
            headers=headers,
            raise_error=False)

        if not result.error:
            raise Return(status_ok())
        else:
            raise Return(status_error(result.error))
    finally:
        client.close()


@coroutine
def check_heapster(settings, status):
    result = yield _check_heapster_status(settings)
    status.heapster = result


def _state_initial():
    # Initial time is EPOCH
    return {'status': None, 'reason': 'Initializing', 'time': 0.0}


def status_error(msg):
    return {'status': False, 'reason': msg, 'time': time.time()}


def status_ok():
    return {'status': True, 'reason': '', 'time': time.time()}


class SystemStatus(object):

    def __init__(self, initial_rcs=[]):
        self.rcs = {}
        for namespace, name in initial_rcs:
            self.rcs[namespace + '.' + name] = _state_initial()

        self.kubernetes = _state_initial()
        self.internet = _state_initial()
        self.heapster = _state_initial()
        self.dns = _state_initial()

    def to_view(self):
        view = {
            'kubernetes': copy.deepcopy(self.kubernetes),
            'internet': copy.deepcopy(self.internet),
            'heapster': copy.deepcopy(self.heapster),
            'dns': copy.deepcopy(self.dns),
        }

        kubernetes_not_ok = not self.kubernetes['status']
        for full_name in self.rcs:
            view[full_name] = copy.deepcopy(self.rcs[full_name])
            if kubernetes_not_ok:
                # The status of RCs is unknown
                view[full_name]['status'] = None
                view[full_name]['reason'] = 'Status is unavailable. Please check the Kubernetes Connection'

        return view


def _get_url(settings, url):
    return settings['kubernetes_url'] + url


def _create_request(settings, url, method='GET'):
    url = _get_url(settings, url)
    if settings['token']:
        headers = {'Authorization': 'Bearer {}'.format(settings['token'])}
    else:
        headers = {}

    return tornado.httpclient.HTTPRequest(url=url, headers=headers, method=method, validate_cert=False,
                                          connect_timeout=30, request_timeout=30)


@coroutine
def _get_json(settings, url):
    client = tornado.httpclient.AsyncHTTPClient()

    try:
        base_response = yield client.fetch(_create_request(settings, url))
    except (IOError, tornado.httpclient.HTTPError) as ex:
        raise RuntimeError('Requesting "{}" failed: "{}"'.format(_get_url(settings, url), unicode(ex)))
    except Exception as ex:
        LOGGER.exception('Exception detected, %s', type(ex))
        raise Return(status_error('Error connecting to "{}": {}'.format(_get_url(settings, url), unicode(ex))))

    if base_response.code != 200:
        raise RuntimeError(
            'Invalid status "{}" when communicating to Kubernetes'.format(base_response.code))

    try:
        response = json.loads(base_response.body)
    except ValueError:
        LOGGER.exception('Exception detected loading JSON')
        raise RuntimeError('Response not a valid json document')

    raise Return(response)


@coroutine
def _check_kubernetes_status(settings):
    try:
        data = yield _get_json(settings, '')
    except (RuntimeError, IOError, tornado.httpclient.HTTPError) as error:
        if settings['token'] is None:
            error_message = "Missing Kubernetes API token, request to API failed. {}".format(unicode(error))
        else:
            error_message = unicode(error)
        raise Return(status_error(error_message))

    if 'paths' not in data or '/api/v1' not in data['paths']:
        raise Return(status_error('Missing /api/v1 in "paths"'))

    raise Return(status_ok())


@coroutine
def check_kubernetes(settings, status):
    state = yield _check_kubernetes_status(settings)
    status.kubernetes = state


@coroutine
def _run_every(fn, args=[], kwargs={}, delay=30):
    """ Runs function async once every delay seconds """
    while True:
        finish_waiting = sleep(delay)
        try:
            yield fn(*args, **kwargs)
        except Exception as e:
            LOGGER.exception('Unexpected exception {}'.format(unicode(e)))

        yield finish_waiting


@coroutine
def _check_dns(settings):
    hostname = settings['dns_test_hostname']
    resolver = tornado.netutil.Resolver()
    try:
        ip = yield resolver.resolve(hostname, 80)
    except (RuntimeError, IOError, tornado.httpclient.HTTPError) as e:
        error_message = unicode(e)
        raise Return(status_error("Couldn't find default DNS {} : {}".format(hostname, error_message)))

    if ip is not None:
        raise Return(status_ok())
    else:
        raise Return(status_error('Hostname to test DNS not found {}'.format(hostname)))


@coroutine
def check_dns(settings, status):
    state = yield _check_dns(settings)
    status.dns = state


@coroutine
def _get_rc(settings, namespace, name):
    url = '/api/v1/namespaces/{namespace}/replicationcontrollers/{name}'.format(
        name=name, namespace=namespace)
    data = yield _get_json(settings, url)
    raise Return(data)


def _document_rc_status(replication_controller):
    if 'spec' not in replication_controller:
        return status_error('Wrong replication controller document, missing "spec"')
    if 'replicas' not in replication_controller['spec']:
        return status_error('Wrong replication controller document, missing "spec.replicas"')

    expected_pods = replication_controller['spec']['replicas']

    if 'status' not in replication_controller:
        return status_error('Wrong replication controller document, missing "status"')
    if 'replicas' not in replication_controller['status']:
        return status_error('Wrong replication controller document, missing "status.replicas"')

    current_pods = replication_controller['status']['replicas']
    if current_pods != expected_pods:
        return status_error('Current pods {}, desired {}'.format(current_pods, expected_pods))
    else:
        return status_ok()


@coroutine
def _check_replicaset(settings, namespace, name):
    try:
        document = yield _get_rc(settings, namespace, name)
    except RuntimeError as ex:
        raise Return(status_error(unicode(ex)))
    except Exception as ex:
        LOGGER.exception('Exception detected, %s', type(ex))
        raise Return(status_error('ex {}'.format(unicode(ex))))

    raise Return(_document_rc_status(document))


@coroutine
def check_replicaset(settings, status, namespace, name):
    result = yield _check_replicaset(settings, namespace, name)
    status.rcs[namespace + '.' + name] = result


def check_replicasets_forever(settings, status, replica_names):
    ''' Start coroutines to update status for the replica (namespace, name) '''
    for namespace, name in replica_names:
        # Do not wait for completion. It will run forever until server finishes asynchronously
        _run_forever(check_replicaset, settings, status, namespace, name)


@coroutine
def _check_internet(settings):
    client = tornado.httpclient.AsyncHTTPClient()
    try:
        response = yield client.fetch(settings['check_connectivity_url'])
    except (IOError, tornado.httpclient.HTTPError) as ex:
        raise Return(status_error(
            'Requesting "{}" failed: "{}"'.format(settings['check_connectivity_url'], unicode(ex))))
    except Exception as ex:
        LOGGER.exception('Exception detected, %s', type(ex))
        raise Return(status_error(unicode(ex)))

    if response.code != 200:
        raise Return(status_error('"{}" responded error ({}) status code'.format(
            settings['check_connectivity_url'], response.code)))

    raise Return(status_ok())


@coroutine
def check_internet(settings, status):
    result = yield _check_internet(settings)
    status.internet = result


def _run_forever(fn, *args):
    IOLoop.current().spawn_callback(
        _run_every, fn, args=args)


def settings_from_env(settings, env):
    settings["KUBERNETES_SERVICE_HOST"] = env['KUBERNETES_SERVICE_HOST']
    settings["KUBERNETES_SERVICE_PORT"] = env['KUBERNETES_SERVICE_PORT']

    if settings["KUBERNETES_SERVICE_PORT"] == '443':
        connection = 'https://{}:{}'.format(settings["KUBERNETES_SERVICE_HOST"], settings["KUBERNETES_SERVICE_PORT"])
    else:
        connection = 'http://{}:{}'.format(settings["KUBERNETES_SERVICE_HOST"], settings["KUBERNETES_SERVICE_PORT"])

    settings['kubernetes_url'] = connection

    if 'KUBE_API_TOKEN_PATH' in env:
        token_path = env['KUBE_API_TOKEN_PATH']
        with open(token_path, 'r') as f:
            token = f.read().rstrip()
    else:
        token = None

    if "HEAPSTER_SERVICE_HOST" in env:
        settings["HEAPSTER_SERVICE_HOST"] = env["HEAPSTER_SERVICE_HOST"]

    if "HEAPSTER_SERVICE_PORT" in env:
        settings["HEAPSTER_SERVICE_PORT"] = env["HEAPSTER_SERVICE_PORT"]

    settings['token'] = token
    settings['check_connectivity_url'] = env.get('CHECK_CONNECTIVITY_URL', 'http://google.com')
    settings['dns_test_hostname'] = env.get('DNS_TEST_HOSTNAME', 'kubernetes.default')


def start_background_checks(settings, status, replica_names):
    LOGGER.debug("Starting background checks")

    _run_forever(check_kubernetes, settings, status)
    check_replicasets_forever(settings, status, replica_names)
    _run_forever(check_internet, settings, status)
    _run_forever(check_heapster, settings, status)
    _run_forever(check_dns, settings, status)


class DiagnosticsHtmlHandler(tornado.web.RequestHandler):

    def initialize(self, status):
        self.status = status

    def get(self):
        self.render('templates/diagnostics.html', status=self.status.to_view())


class DiagnosticsJsonHandler(tornado.web.RequestHandler):

    def initialize(self, status):
        self.status = status

    def get(self):
        self.write(json.dumps(self.status.to_view()))


# UI Components
class StateUI(tornado.web.UIModule):

    def render(self, state, title):
        return self.render_string('templates/state.html', state=state, title=title)


ui_modules = {"StateUI": StateUI}


def create_application(system_status, statics_path, debug):
    return tornado.web.Application([
        (r'/', DiagnosticsHtmlHandler, {'status': system_status}),
        (r'/json', DiagnosticsJsonHandler, {'status': system_status}),
        (r'/assets/(.*)', tornado.web.StaticFileHandler, {'path': statics_path}),
    ], ui_modules=ui_modules, debug=debug, autoreload=debug)


def run_server():
    level = 'WARNING' if not os.getenv('DEBUG') else 'DEBUG'
    logging.basicConfig(level=level)

    LOGGER.info('Starting server')
    tornado.netutil.Resolver.configure('tornado.netutil.ThreadedResolver', num_threads=10)

    settings = {}
    settings_from_env(settings, os.environ)

    replication_controllers = (
        ('kube-system', 'elastickube-server'),
        ('kube-system', 'elastickube-mongo'),
    )
    LOGGER.debug('Loaded settings')

    system_status = SystemStatus(replication_controllers)

    start_background_checks(settings, system_status, replication_controllers)

    statics_path = os.path.join(os.path.dirname(__file__), 'assets')
    application = create_application(system_status, statics_path, bool(os.getenv('DEBUG')))
    server = tornado.httpserver.HTTPServer(application)

    socket = tornado.netutil.bind_unix_socket("/var/run/elastickube-diagnostics.sock", mode=0777)
    server.add_socket(socket)

    if os.getenv('DEBUG'):
        IOLoop.current().set_blocking_log_threshold(0.5)

    IOLoop.current().start()


if __name__ == '__main__':
    run_server()

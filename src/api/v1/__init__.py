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

import httplib
import json
import logging
import os
from datetime import datetime, timedelta

import jwt
from bson.json_util import dumps
from motor.motor_tornado import MotorClient
from tornado.gen import coroutine
from tornado.ioloop import IOLoop
from tornado.websocket import WebSocketHandler, WebSocketClosedError

from api.kube import client
from api.v1.sync import SyncNamespaces
from data import watch, init as initialize_database

PING_FREQUENCY = timedelta(seconds=5)
RESPONSE_TIMEOUT = timedelta(seconds=5)
ELASTICKUBE_TOKEN_HEADER = "ElasticKube-Token"
ELASTICKUBE_VALIDATION_TOKEN_HEADER = "ElasticKube-Validation-Token"


def configure(settings):
    if os.path.exists('/var/run/secrets/kubernetes.io/serviceaccount/token'):
        with open('/var/run/secrets/kubernetes.io/serviceaccount/token') as token:
            settings['kube'] = client.KubeClient(os.getenv('KUBERNETES_SERVICE_HOST'), token=token.read())

    mongo_url = "mongodb://{0}:{1}/".format(
        os.getenv('ELASTICKUBE_MONGO_SERVICE_HOST', 'localhost'),
        os.getenv('ELASTICKUBE_MONGO_SERVICE_PORT', 27017)
    )

    settings['motor'] = MotorClient(mongo_url)
    settings['database'] = settings['motor'].elastickube


@coroutine
def initialize(settings):
    yield initialize_database(settings['database'])
    yield settings["kube"].build_resources()

    yield SyncNamespaces(settings).start_sync()
    watch.start_monitor(settings['motor'])


class SecureWebSocketHandler(WebSocketHandler):

    def __init__(self, application, request, **kwargs):
        super(SecureWebSocketHandler, self).__init__(application, request, **kwargs)

        self.user = None
        self.ping_timeout_handler = None

    def open(self):
        # Try the header if not the cookie
        encoded_token = self.request.headers.get(ELASTICKUBE_TOKEN_HEADER)
        if encoded_token is None:
            encoded_token = self.get_cookie(ELASTICKUBE_TOKEN_HEADER)

        if encoded_token is None:
            self.write_message({"error": {"message": "Invalid token."}})
            self.close(httplib.UNAUTHORIZED, "Invalid token.")
        else:
            token = None
            try:
                token = jwt.decode(encoded_token, self.settings['secret'], algorithm='HS256')
            except jwt.DecodeError as jwt_error:
                logging.exception(jwt_error)
                self.write_message({"error": {"message": "Invalid token."}})
                self.close(httplib.UNAUTHORIZED, "Invalid token.")

            if token:
                self.user = self.settings["database"].Users.find_one({"username": token["username"]})
                self.ping_timeout_handler = IOLoop.current().add_timeout(PING_FREQUENCY, self.send_ping)

    def on_message(self, message):
        pass

    def write_message(self, message, binary=False):
        serialized = dumps(message)
        super(SecureWebSocketHandler, self).write_message(serialized, binary=binary)

    @coroutine
    def send_ping(self):
        try:
            self.ping('instance')
            self.ping_timeout_handler = IOLoop.current().add_timeout(RESPONSE_TIMEOUT, self.close)
        except WebSocketClosedError:
            logging.debug('WebSocket connection closed when sending a ping.')
            self.close()

    @coroutine
    def on_pong(self, _data):
        if self.ping_timeout_handler is not None:
            IOLoop.current().remove_timeout(self.ping_timeout_handler)

        self.ping_timeout_handler = IOLoop.current().add_timeout(PING_FREQUENCY, self.send_ping)

    @coroutine
    def on_close(self):
        if self.ping_timeout_handler is not None:
            IOLoop.current().remove_timeout(self.ping_timeout_handler)

        self.ping_timeout_handler = None

    def check_origin(self, _origin):
        return True

    def data_received(self, _origin):
        return True


def get_icon_template(icon_template_file):
    with open(icon_template_file, 'r') as box_icon:
        template = box_icon.read()

    timestamp = os.path.getmtime(icon_template_file)

    return {
        "template": template,
        "last_modified": datetime.utcfromtimestamp(timestamp)
    }


def load_colors(color_definition_template):
    colors = {}
    with open(color_definition_template) as colors_file:
        for color_name, color_value in json.load(colors_file).iteritems():
            colors[color_name] = color_value

    return colors

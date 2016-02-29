import datetime
import logging
import json
import jwt
import os

from bson.json_util import dumps
from datetime import timedelta
from motor.motor_tornado import MotorClient
from tornado.gen import coroutine
from tornado.ioloop import IOLoop
from tornado.web import HTTPError
from tornado.websocket import WebSocketHandler, WebSocketClosedError

from api.v1.sync import SyncNamespaces
from data import watch, init as initialize_database
from api.kube import client

PING_FREQUENCY = timedelta(seconds=5)
RESPONSE_TIMEOUT = timedelta(seconds=5)
ELASTICKUBE_TOKEN_HEADER = "ElasticKube-Token"


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
        self.ping_timeout_handler = IOLoop.current().add_timeout(PING_FREQUENCY, self.send_ping)

        try:
            # Try the header if not the cookie
            encoded_token = self.request.headers.get(ELASTICKUBE_TOKEN_HEADER)
            if encoded_token is None:
                encoded_token = self.get_cookie(ELASTICKUBE_TOKEN_HEADER)

            if encoded_token is None:
                raise HTTPError(401, "Invalid token.")

            token = jwt.decode(encoded_token, self.settings['secret'], algorithm='HS256')
            self.user = self.settings["database"].Users.find_one({"username": token["username"]})

            if self.user is None:
                logging.debug("User not found.")
                raise HTTPError(401, "Invalid token.")

        except jwt.DecodeError as e:
            logging.exception(e)
            logging.debug("The token could not decoded.")
            raise HTTPError(401, "Invalid token.")

    def on_message(self, message):
        pass

    def write_message(self, message):
        serialized = dumps(message)
        super(SecureWebSocketHandler, self).write_message(serialized)

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
        "last_modified": datetime.datetime.utcfromtimestamp(timestamp)
    }


def load_colors(color_definition_template):
    colors = {}
    with open(color_definition_template) as colors_file:
        for color_name, color_value in json.load(colors_file).iteritems():
            colors[color_name] = color_value
    return colors

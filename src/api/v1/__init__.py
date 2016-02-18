import logging
import jwt
import os

from bson.json_util import dumps
from datetime import timedelta
from motor.motor_tornado import MotorClient
from tornado.gen import coroutine, Return
from tornado.ioloop import IOLoop
from tornado.web import RequestHandler, HTTPError
from tornado.websocket import WebSocketHandler, WebSocketClosedError

from api.db import watch, init as initialize_database
from api.kube import client

PING_FREQUENCY = timedelta(seconds=5)
RESPONSE_TIMEOUT = timedelta(seconds=5)
ELASTICKUBE_TOKEN_HEADER = "ElasticKube-Token"


def initialize(settings):
    if os.path.exists('/var/run/secrets/kubernetes.io/serviceaccount/token'):
        with open('/var/run/secrets/kubernetes.io/serviceaccount/token') as token:
            settings['kube'] = client.KubeClient(os.getenv('KUBERNETES_SERVICE_HOST'), token=token.read())

    mongo_url = "mongodb://{0}:{1}/".format(
        os.getenv('ELASTICKUBE_MONGO_SERVICE_HOST', 'localhost'),
        os.getenv('ELASTICKUBE_MONGO_SERVICE_PORT', 27017)
    )

    motor_client = MotorClient(mongo_url)
    settings['database'] = motor_client.elastickube

    initialize_database(mongo_url)
    IOLoop.current().add_callback(watch.start_monitor,  motor_client)


class SecureWebSocketHandler(WebSocketHandler):

    def __init__(self, application, request, **kwargs):
        super(SecureWebSocketHandler, self).__init__(application, request, **kwargs)

        self.user = None
        self.ping_timeout_handler = None

    @coroutine
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
            self.user = yield self.settings["database"].Users.find_one({"username": token["username"]})

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

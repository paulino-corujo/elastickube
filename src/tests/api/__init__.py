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

import os
import json
import uuid

from tornado import testing
from tornado.gen import coroutine, Return
from tornado.httpclient import AsyncHTTPClient, HTTPRequest
from tornado.websocket import websocket_connect

ELASTICKUBE_TOKEN_HEADER = "ElasticKube-Token"


class ApiTestCase(testing.AsyncTestCase):

    def setUp(self):
        super(ApiTestCase, self).setUp()

        request = self.build_request()
        self.connection = self.io_loop.run_sync(lambda: websocket_connect(request))

    def tearDown(self):
        self.connection.close()
        super(ApiTestCase, self).tearDown()

    @staticmethod
    def get_api_address():
        return os.getenv("ELASTICKUBE_API_ADDRESS", "localhost")

    @coroutine
    def get_token(self, username="operations@elasticbox.com", password="elastickube123"):
        response = yield AsyncHTTPClient(self.io_loop).fetch(
            "http://%s/api/v1/auth/login" % self.get_api_address(),
            method="POST",
            body=json.dumps(dict(username=username, password=password)))

        raise Return(response.body)

    @testing.gen_test
    def build_request(self, username="operations@elasticbox.com", password="elastickube123"):
        token = yield self.get_token(username, password)
        request = HTTPRequest(
            "ws://%s/api/v1/ws" % self.get_api_address(),
            headers=dict([(ELASTICKUBE_TOKEN_HEADER, token)]),
            validate_cert=False
        )

        raise Return(request)

    def send_message(self, action, operation, body=None):
        correlation = str(uuid.uuid4())[:10]
        message = dict(action=action, operation=operation, correlation=correlation)
        if body:
            message["body"] = body

        self.connection.write_message(json.dumps(message))
        return correlation

    @staticmethod
    @coroutine
    def wait_message(connection, correlation=None):
        deserialized_message = None
        while True:
            message = yield connection.read_message()
            deserialized_message = json.loads(message)
            if not correlation:
                break
            if "correlation" in deserialized_message and deserialized_message["correlation"] == correlation:
                break

        raise Return(deserialized_message)

    def validate_response(self, response, status, correlation, operation, action):
        self.assertTrue(response["status_code"] == status, response)
        self.assertTrue(response["correlation"] == correlation, response)
        self.assertTrue(response["operation"] == operation, response)
        self.assertTrue(response["action"] == action, response)

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
import uuid

import unittest2
from tornado import testing
from tornado.httpclient import HTTPRequest
from tornado.websocket import websocket_connect

from tests import api


class TestMainWebSocket(api.ApiTestCase):

    @testing.gen_test(timeout=60)
    def test_invalid_token(self):
        request = HTTPRequest(
            "ws://%s/api/v1/ws" % self.get_api_address(),
            headers=dict([(api.ELASTICKUBE_TOKEN_HEADER, 'fake_token')]),
            validate_cert=False
        )

        connection = yield websocket_connect(request)
        connection.write_message(json.dumps({
            "action": "charts",
            "operation": "watch",
            "correlation": str(uuid.uuid4())[:10]
        }))

        response = yield self.wait_message(connection)
        self.assertTrue(isinstance(response, dict), "Body is not a dict but %s" % type(response))
        self.assertTrue(response["error"]["message"] == "Invalid token.",
                        "Message is %s instead of 'Invalid token.'" % (response["error"]["message"]))
        connection.close()

    @testing.gen_test(timeout=60)
    def test_message_validation(self):
        self.connection.write_message("No JSON object")
        response = yield self.connection.read_message()
        self.assertTrue(response == '"Message \'No JSON object\' cannot be deserialized"',
                        "Received %s instead of '\"Message 'No JSON object' cannot be deserialized\"'" % response)

        self.connection.write_message(json.dumps({"operation": "create", "correlation": 123}))
        response = yield self.connection.read_message()
        expected_response = "\"Message {\\\"operation\\\": \\\"create\\\", \\\"correlation\\\": 123}" \
                            " does not contain 'action'\""
        self.assertTrue(response == expected_response, "Received %s instead of '%s'" % (response, expected_response))

        self.connection.write_message(json.dumps({"action": "users", "correlation": 123}))
        response = yield self.connection.read_message()
        expected_response = "\"Message {\\\"action\\\": \\\"users\\\", \\\"correlation\\\": 123}" \
                            " does not contain 'operation'\""
        self.assertTrue(response == expected_response, "Received %s instead of '%s'" % (response, expected_response))

        self.connection.write_message(json.dumps({"action": "users", "operation": "create"}))

        response = yield self.connection.read_message()
        expected_response = "\"Message {\\\"action\\\": \\\"users\\\", \\\"operation\\\": \\\"create\\\"}" \
                            " does not contain 'correlation'\""
        self.assertTrue(response == expected_response, "Received %s instead of '%s'" % (response, expected_response))

        correlation = self.send_message("fake_action", "create")
        response = yield self.wait_message(self.connection, correlation)
        self.validate_response(response, 400, correlation, "create", "fake_action")
        self.assertTrue(isinstance(response["body"], dict), "Body is not a dict but %s" % type(response["body"]))
        self.assertTrue(response["body"]["message"] == "Action fake_action not supported.",
                        "Message is %s instead of 'Action fake_action not supported.'" % response['body']["message"])

        correlation = self.send_message("users", "fake_operation")
        response = yield self.wait_message(self.connection, correlation)
        self.validate_response(response, 400, correlation, "fake_operation", "users")
        self.assertTrue(isinstance(response["body"], dict), "Body is not a dict but %s" % type(response["body"]))
        self.assertTrue(response["body"]["message"] == "Operation fake_operation not supported.",
                        "Message is %s instead of 'Operation fake_operation not supported.'" %
                        response['body']["message"])


if __name__ == "__main__":
    unittest2.main()

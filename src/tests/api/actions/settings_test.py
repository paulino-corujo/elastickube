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


class TestActionsSettings(api.ApiTestCase):

    @testing.gen_test(timeout=60)
    def test_create_settings(self):
        correlation = self.send_message("settings", "create")
        response = yield self.wait_message(self.connection, correlation)
        self.validate_response(response, 405, correlation, "create", "settings")
        self.assertTrue(isinstance(response["body"], dict), "Body is not a dict but %s" % type(response["body"]))
        self.assertTrue(response["body"]["message"] == "Operation create not supported for action settings.",
                        "Message is %s instead of 'Operation create not supported for action settings.'" %
                        response['body']["message"])

    @testing.gen_test(timeout=60)
    def test_update_settings(self):
        correlation = self.send_message("settings", "watch")
        response = yield self.wait_message(self.connection, correlation)
        self.validate_response(response, 200, correlation, "watched", "settings")
        self.assertTrue(isinstance(response["body"], list), "Body is not a list but %s" % type(response["body"]))
        self.assertTrue(len(response["body"]) > 0, "No Settings returned as part of the response")
        self.assertTrue(len(response["body"]) < 2, "Multiple Settings returned as part of the response")

        settings = response["body"][0]

        correlation = self.send_message("settings", "update", body=settings)
        response = yield self.wait_message(self.connection, correlation)
        self.validate_response(response, 200, correlation, "updated", "settings")
        self.assertTrue(isinstance(response["body"], dict), "Body is not a dict but %s" % type(response["body"]))
        previous_version = settings["metadata"]["resourceVersion"]
        self.assertTrue(response["body"]["metadata"]["resourceVersion"] > previous_version,
                        "resourceVersion is equal or lower than before, %s %s  " % (
                            previous_version, response["body"]["metadata"]["resourceVersion"]))

    @testing.gen_test(timeout=60)
    def test_delete_settings(self):
        correlation = self.send_message("settings", "delete")
        response = yield self.wait_message(self.connection, correlation)
        self.validate_response(response, 405, correlation, "delete", "settings")
        self.assertTrue(isinstance(response["body"], dict), "Body is not a dict but %s" % type(response["body"]))
        self.assertTrue(response["body"]["message"] == "Operation delete not supported for action settings.",
                        "Message is %s instead of 'Operation delete not supported for action settings.'" %
                        response['body']["message"])

    @testing.gen_test(timeout=10)
    def test_forbidden_update(self):
        token = yield self.get_token("engineer@elasticbox.com", "elastickube123")
        request = HTTPRequest(
            "ws://%s/api/v1/ws" % self.get_api_address(),
            headers=dict([(api.ELASTICKUBE_TOKEN_HEADER, token)]),
            validate_cert=False
        )

        connection = yield websocket_connect(request)

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({"action": "settings", "operation": "update", "correlation": correlation}))
        response = yield self.wait_message(connection, correlation)
        self.validate_response(response, 403, correlation, "update", "settings")
        self.assertTrue(isinstance(response["body"], dict), "Body is not a dict but %s" % type(response["body"]))

        self.assertTrue(response["body"]["message"] == "Operation update forbidden for action settings.",
                        "Message is %s instead of 'Operation update forbidden for action settings.'" %
                        response["body"]["message"])

        connection.close()


if __name__ == "__main__":
    unittest2.main()

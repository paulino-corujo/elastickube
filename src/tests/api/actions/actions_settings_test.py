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
import logging
import uuid

from tornado import testing
from tornado.websocket import websocket_connect

from tests.api import wait_message, get_ws_request, validate_response


class ActionsSettingsTests(testing.AsyncTestCase):

    _multiprocess_can_split_ = True

    @testing.gen_test(timeout=60)
    def test_create_settings(self):
        logging.debug("Start test_create_settings")

        request = yield get_ws_request(self.io_loop)
        connection = yield websocket_connect(request)

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "settings",
            "operation": "create",
            "correlation": correlation,
            "body": dict()
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=405, correlation=correlation, operation="create", action="settings", body_type=dict))

        expected_message = "Operation create not supported for action settings."
        self.assertTrue(message["body"]["message"] == expected_message,
                        "Message is %s instead of '%s'" % (message["body"]["message"], expected_message))

        connection.close()
        logging.debug("Completed test_create_settings")

    @testing.gen_test(timeout=60)
    def test_update_settings(self):
        logging.debug("Start test_update_settings")

        request = yield get_ws_request(self.io_loop)
        connection = yield websocket_connect(request)

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "settings",
            "operation": "watch",
            "correlation": correlation
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=200, correlation=correlation, operation="watched", action="settings", body_type=list))

        self.assertTrue(len(message["body"]) > 0, "No Settings returned as part of the response")
        self.assertTrue(len(message["body"]) < 2, "Multiple Settings returned as part of the response")

        settings = message["body"][0]

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "settings",
            "operation": "update",
            "correlation": correlation,
            "body": settings
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=200, correlation=correlation, operation="updated", action="settings", body_type=dict))

        previous_version = settings["metadata"]["resourceVersion"]
        self.assertTrue(message["body"]["metadata"]["resourceVersion"] > previous_version,
                        "resourceVersion is equal or lower than before, %s %s  " % (
                            previous_version, message["body"]["metadata"]["resourceVersion"]))

        connection.close()
        logging.debug("Completed test_update_settings")

    @testing.gen_test(timeout=60)
    def test_delete_settings(self):
        logging.debug("Start test_delete_settings")

        request = yield get_ws_request(self.io_loop)
        connection = yield websocket_connect(request)

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "settings",
            "operation": "delete",
            "correlation": correlation,
            "body": dict()
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=405, correlation=correlation, operation="delete", action="settings", body_type=dict))

        expected_message = "Operation delete not supported for action settings."
        self.assertTrue(message["body"]["message"] == expected_message,
                        "Message is %s instead of '%s'" % (message["body"]["message"], expected_message))

        connection.close()
        logging.debug("Completed test_delete_settings")

    @testing.gen_test(timeout=60)
    def test_forbidden_update(self):
        logging.debug("Start test_forbidden_update")

        request = yield get_ws_request(self.io_loop, username="engineer@elasticbox.com")
        connection = yield websocket_connect(request)

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "settings",
            "operation": "update",
            "correlation": correlation,
            "body": dict()
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=403, correlation=correlation, operation="update", action="settings", body_type=dict))

        expected_message = "Operation update forbidden for action settings."
        self.assertTrue(message["body"]["message"] == expected_message,
                        "Message is %s instead of '%s'" % (message["body"]["message"], expected_message))

        connection.close()
        logging.debug("Completed test_forbidden_update")


if __name__ == "__main__":
    testing.main()

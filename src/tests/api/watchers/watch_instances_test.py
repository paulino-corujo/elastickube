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

from tests.api import get_ws_request, validate_response, wait_message


class WatchInstancesTest(testing.AsyncTestCase):

    @testing.gen_test(timeout=60)
    def test_watch_instances(self):
        logging.debug("Start test_watch_instances")

        request = yield get_ws_request(self.io_loop)
        connection = yield websocket_connect(request)

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "instances",
            "operation": "watch",
            "correlation": correlation
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=200, correlation=correlation, operation="watched", action="instances", body_type=list))
        self.assertTrue(len(message["body"]) > 0, "No instances returned as part of the response")

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "instances",
            "operation": "watch",
            "correlation": correlation,
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=400, correlation=correlation, operation="watched", action="instances", body_type=dict))
        self.assertTrue(message["body"]["message"] == "Action already watched.",
                        "Message is %s instead of 'Action already watched.'" % message["body"]["message"])

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "instances",
            "operation": "watch",
            "correlation": correlation,
            "body": {"namespace": "kube-system"}
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=200, correlation=correlation, operation="watched", action="instances", body_type=list))
        self.assertTrue(len(message["body"]) > 0, "No instances returned as part of the response")

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "instances",
            "operation": "watch",
            "correlation": correlation,
            "body": {"namespace": "kube-system"}
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=400, correlation=correlation, operation="watched", action="instances", body_type=dict))
        self.assertTrue(message["body"]["message"] == "Action already watched.",
                        "Message is %s instead of 'Action already watched.'" % message["body"]["message"])

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "instances",
            "operation": "unwatch",
            "correlation": correlation,
            "body": {"namespace": "kube-system"}
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=200, correlation=correlation, operation="unwatched", action="instances", body_type=dict))
        self.assertTrue(len(message['body'].keys()) == 0, "Body is not empty")

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "instances",
            "operation": "unwatch",
            "correlation": correlation,
            "body": {"namespace": "kube-system"}
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=400, correlation=correlation, operation="unwatched", action="instances", body_type=dict))
        self.assertTrue(message["body"]["message"] == "Action not previously watch.",
                        "Message is %s instead of 'Action not previously watch.'" % message["body"]["message"])

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "instances",
            "operation": "unwatch",
            "correlation": correlation
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=200, correlation=correlation, operation="unwatched", action="instances", body_type=dict))
        self.assertTrue(len(message['body'].keys()) == 0, "Body is not empty")

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "instances",
            "operation": "unwatch",
            "correlation": correlation
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=400, correlation=correlation, operation="unwatched", action="instances", body_type=dict))
        self.assertTrue(message["body"]["message"] == "Action not previously watch.",
                        "Message is %s instead of 'Action not previously watch.'" % message["body"]["message"])

        connection.close()
        logging.debug("Completed test_watch_instances")


if __name__ == '__main__':
    testing.main()

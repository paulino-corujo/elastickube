"""
ElasticBox Confidential
Copyright (c) 2016 All Right Reserved, ElasticBox Inc.

NOTICE:  All information contained herein is, and remains the property
of ElasticBox. The intellectual and technical concepts contained herein are
proprietary and may be covered by U.S. and Foreign Patents, patents in process,
and are protected by trade secret or copyright law. Dissemination of this
information or reproduction of this material is strictly forbidden unless prior
written permission is obtained from ElasticBox
"""

import json
import logging
import uuid

from tornado import testing
from tornado.websocket import websocket_connect

from tests.api import get_ws_request, validate_response, wait_message


class WatchInstancesTest(testing.AsyncTestCase):

    @testing.gen_test(timeout=60)
    def watch_instances_test(self):
        logging.debug("Start watch_instances_test")

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
        logging.debug("Completed watch_instances_test")


if __name__ == '__main__':
    testing.main()

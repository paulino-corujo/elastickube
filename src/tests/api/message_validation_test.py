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
from tornado.httpclient import HTTPRequest, AsyncHTTPClient
from tornado.websocket import websocket_connect

from tests.api import get_token, wait_message, ELASTICKUBE_TOKEN_HEADER


class MessageValidationTest(testing.AsyncTestCase):

    @testing.gen_test(timeout=60)
    def message_validation_test(self):
        logging.debug("Start message_validation_test")

        token = yield get_token(self.io_loop)
        request = HTTPRequest(
            "ws://localhost/api/v1/ws",
            headers=dict([(ELASTICKUBE_TOKEN_HEADER, token)]),
            validate_cert=False
        )

        connection = yield websocket_connect(request)

        connection.write_message("No JSON object")
        message = yield connection.read_message()
        self.assertTrue(message == '"Message \'No JSON object\' cannot be deserialized"',
                        "Received %s instead of '\"Message 'No JSON object' cannot be deserialized\"'" % message)

        connection.write_message(json.dumps({
            "operation": "create",
            "correlation": 123
        }))

        message = yield connection.read_message()
        expected_message = "\"Message {\\\"operation\\\": \\\"create\\\", \\\"correlation\\\": 123}"\
            " does not contain 'action'\""
        self.assertTrue(message == expected_message, "Received %s instead of '%s'" % (message, expected_message))

        connection.write_message(json.dumps({
            "action": "users",
            "correlation": 123
        }))

        message = yield connection.read_message()
        expected_message = "\"Message {\\\"action\\\": \\\"users\\\", \\\"correlation\\\": 123}" \
                           " does not contain 'operation'\""
        self.assertTrue(message == expected_message, "Received %s instead of '%s'" % (message, expected_message))

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "fake_action",
            "operation": "create",
            "correlation": correlation
        }))

        deserialized_message = yield wait_message(connection, correlation)
        self.assertTrue(deserialized_message['status_code'] == 400,
                        "Status code is %d instead of 400" % deserialized_message['status_code'])
        self.assertTrue(deserialized_message['correlation'] == correlation,
                        "Correlation is %s instead of %s" % (deserialized_message["correlation"], correlation))
        self.assertTrue(deserialized_message['operation'] == "create",
                        "Operation is %s instead of create" % deserialized_message['operation'])
        self.assertTrue(deserialized_message['action'] == "fake_action",
                        "Action is %s instead of fake_action" % deserialized_message['action'])
        self.assertTrue(isinstance(deserialized_message['body'], dict),
                        "Body is not a dict but %s" % type(deserialized_message['body']))

        expected_message = "Action fake_action not supported."
        self.assertTrue(deserialized_message["body"]["message"] == expected_message,
                        "Message is %s instead of '%s'" % (deserialized_message['body']["message"], expected_message))

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "users",
            "operation": "fake_operation",
            "correlation": correlation
        }))

        deserialized_message = yield wait_message(connection, correlation)
        self.assertTrue(deserialized_message['status_code'] == 400,
                        "Status code is %d instead of 400" % deserialized_message['status_code'])
        self.assertTrue(deserialized_message['correlation'] == correlation,
                        "Correlation is %s instead of %s" % (deserialized_message["correlation"], correlation))
        self.assertTrue(deserialized_message['operation'] == "fake_operation",
                        "Operation is %s instead of fake_operation" % deserialized_message['operation'])
        self.assertTrue(deserialized_message['action'] == "users",
                        "Action is %s instead of users" % deserialized_message['action'])
        self.assertTrue(isinstance(deserialized_message['body'], dict),
                        "Body is not a dict but %s" % type(deserialized_message['body']))

        expected_message = "Operation fake_operation not supported."
        self.assertTrue(deserialized_message["body"]["message"] == expected_message,
                        "Message is %s instead of '%s'" % (deserialized_message['body']["message"], expected_message))

        connection.close()
        logging.debug("Completed message_validation_test")


if __name__ == '__main__':
    testing.main()

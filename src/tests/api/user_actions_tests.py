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

from tornado import testing
from tornado.httpclient import HTTPRequest, AsyncHTTPClient
from tornado.websocket import websocket_connect

from tests.api import get_token, ELASTICKUBE_TOKEN_HEADER


class UserActionTests(testing.AsyncTestCase):

    _multiprocess_can_split_ = True

    @testing.gen_test(timeout=60)
    def create_user_test(self):
        logging.debug("Start create_user_test")
        token = yield get_token(self.io_loop)
        request = HTTPRequest(
            "ws://localhost/api/v1/ws",
            headers=dict([(ELASTICKUBE_TOKEN_HEADER, token)]),
            validate_cert=False
        )

        connection = yield websocket_connect(request)
        connection.write_message(json.dumps({
            "action": "users",
            "operation": "create",
            "correlation": 123,
            "body": dict(
                email="test_user@elasticbox.com",
                username="test_user@elasticbox.com",
                password="fake",
                firstname="test",
                lastname="user",
                role="user",
                schema="http://elasticbox.net/schemas/user"
            )
        }))

        message = yield connection.read_message()
        deserialized_message = json.loads(message)
        self.assertTrue(deserialized_message['status_code'] == 200,
                        "Status code is %d instead of 200" % deserialized_message['status_code'])
        self.assertTrue(deserialized_message['correlation'] == 123,
                        "Correlation is %d instead of 123" % deserialized_message['correlation'])
        self.assertTrue(deserialized_message['operation'] == "created",
                        "Operation is %s instead of created" % deserialized_message['operation'])
        self.assertTrue(deserialized_message['action'] == "users",
                        "Action is %s instead of users" % deserialized_message['action'])
        self.assertTrue(isinstance(deserialized_message['body'], dict),
                        "Body is not a dict" % deserialized_message['body'])
        self.assertTrue(deserialized_message['body']['email'] == "test_user@elasticbox.com",
                        "Email is %s instead of 'test_user@elasticbox.com'" % deserialized_message['body']['username'])

        connection.write_message(json.dumps({
            "action": "users",
            "operation": "delete",
            "correlation": 123,
            "body": dict(_id=deserialized_message["body"]["_id"]["$oid"])
        }))

        message = yield connection.read_message()
        deserialized_message = json.loads(message)
        self.assertTrue(deserialized_message['status_code'] == 200,
                        "Status code is %d instead of 200" % deserialized_message['status_code'])
        self.assertTrue(deserialized_message['correlation'] == 123,
                        "Correlation is %d instead of 123" % deserialized_message['correlation'])
        self.assertTrue(deserialized_message['operation'] == "deleted",
                        "Operation is %s instead of deleted" % deserialized_message['operation'])
        self.assertTrue(deserialized_message['action'] == "users",
                        "Action is %s instead of users" % deserialized_message['action'])
        self.assertTrue(isinstance(deserialized_message["body"], dict),
                        "Body is not a dict" % deserialized_message['body'])
        logging.error(deserialized_message['body'])

        connection.close()
        logging.debug("Completed create_user_test")


if __name__ == '__main__':
    testing.main()

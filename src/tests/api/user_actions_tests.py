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

from bson.objectid import ObjectId
from motor.motor_tornado import MotorClient
from tornado import testing
from tornado.httpclient import HTTPRequest, AsyncHTTPClient
from tornado.websocket import websocket_connect

from tests.api import get_token, ELASTICKUBE_TOKEN_HEADER


class UserActionTests(testing.AsyncTestCase):

    _multiprocess_can_split_ = True

    def setUp(self):
        super(UserActionTests, self).setUp()
        self.user_id = None
        self.user_email = "test_%s@elasticbox.com" % str(uuid.uuid4())[:10]

    def tearDown(self):
        if self.user_id:
            self._delete_user()

        super(UserActionTests, self).tearDown()

    @testing.gen_test
    def _delete_user(self):
        database = MotorClient("mongodb://localhost:27017/").elastickube
        yield database.Users.remove({"_id": ObjectId(self.user_id)})

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
                email=self.user_email,
                username=self.user_email,
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
                        "Body is not a dict but %s" % type(deserialized_message['body']))
        self.assertTrue(deserialized_message['body']['email'] == self.user_email,
                        "Email is %s instead of '%s'" % (deserialized_message['body']['username'], self.user_email))

        self.user_id = deserialized_message["body"]["_id"]["$oid"]
        connection.write_message(json.dumps({
            "action": "users",
            "operation": "delete",
            "correlation": 123,
            "body": dict(_id=self.user_id)
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
        self.assertIsNone(deserialized_message["body"],
                          "Body is not a None but %s" % deserialized_message['body'])

        connection.write_message(json.dumps({
            "action": "users",
            "operation": "delete",
            "correlation": 123,
            "body": dict(_id=self.user_id)
        }))

        message = yield connection.read_message()
        deserialized_message = json.loads(message)
        self.assertTrue(deserialized_message['status_code'] == 404,
                        "Status code is %d instead of 404" % deserialized_message['status_code'])
        self.assertTrue(deserialized_message['correlation'] == 123,
                        "Correlation is %d instead of 123" % deserialized_message['correlation'])
        self.assertTrue(deserialized_message['operation'] == "deleted",
                        "Operation is %s instead of deleted" % deserialized_message['operation'])
        self.assertTrue(deserialized_message['action'] == "users",
                        "Action is %s instead of users" % deserialized_message['action'])
        self.assertTrue(isinstance(deserialized_message["body"], dict),
                        "Body is not a dict but %s" % type(deserialized_message['body']))
        self.assertTrue(deserialized_message["body"]["message"] == 'Object not found.',
                        "Message is %s instead of 'Object not found.'" % deserialized_message['body']["message"])

        connection.close()
        logging.debug("Completed create_user_test")

    @testing.gen_test(timeout=60)
    def duplicate_user_test(self):
        logging.debug("Start duplicate_user_test")

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
                email=self.user_email,
                username=self.user_email,
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
                        "Body is not a dict but %s" % type(deserialized_message['body']))
        self.assertTrue(deserialized_message['body']['email'] == self.user_email,
                        "Email is %s instead of '%s'" % (deserialized_message['body']['username'], self.user_email))

        self.user_id = deserialized_message["body"]["_id"]["$oid"]
        connection.write_message(json.dumps({
            "action": "users",
            "operation": "create",
            "correlation": 123,
            "body": dict(
                email=self.user_email,
                username=self.user_email,
                password="fake",
                firstname="test",
                lastname="user",
                role="user",
                schema="http://elasticbox.net/schemas/user"
            )
        }))

        message = yield connection.read_message()
        deserialized_message = json.loads(message)
        self.assertTrue(deserialized_message['status_code'] == 409,
                        "Status code is %d instead of 409" % deserialized_message['status_code'])
        self.assertTrue(deserialized_message['correlation'] == 123,
                        "Correlation is %d instead of 123" % deserialized_message['correlation'])
        self.assertTrue(deserialized_message['operation'] == "created",
                        "Operation is %s instead of created" % deserialized_message['operation'])
        self.assertTrue(deserialized_message['action'] == "users",
                        "Action is %s instead of users" % deserialized_message['action'])
        self.assertTrue(isinstance(deserialized_message['body'], dict),
                        "Body is not a dict but %s" % type(deserialized_message['body']))

        expected_message = "Users object with email %s already exists" % self.user_email
        self.assertTrue(deserialized_message['body']['message'] == expected_message,
                        "Message is %s instead of '%s'" % (deserialized_message['body']["message"], expected_message))

        logging.debug("Completed duplicate_user_test")


if __name__ == '__main__':
    testing.main()

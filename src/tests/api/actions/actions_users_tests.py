import json
import logging
import uuid

from bson.objectid import ObjectId
from motor.motor_tornado import MotorClient
from tornado import testing
from tornado.websocket import websocket_connect

from tests.api import get_ws_request, validate_response, wait_message


class ActionsUsersTests(testing.AsyncTestCase):

    _multiprocess_can_split_ = True

    def setUp(self):
        super(ActionsUsersTests, self).setUp()

        self.user_id = None
        self.user_email = "test_%s@elasticbox.com" % str(uuid.uuid4())[:10]

    def tearDown(self):
        if self.user_id:
            self._delete_user()

        super(ActionsUsersTests, self).tearDown()

    @testing.gen_test
    def _delete_user(self):
        database = MotorClient("mongodb://localhost:27017/").elastickube
        yield database.Users.remove({"_id": ObjectId(self.user_id)})

    @testing.gen_test(timeout=60)
    def create_user_test(self):
        logging.debug("Start create_user_test")

        request = yield get_ws_request(self.io_loop)
        connection = yield websocket_connect(request)

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "users",
            "operation": "create",
            "correlation": correlation,
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

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=200, correlation=correlation, operation="created", action="users", body_type=dict))

        self.assertTrue(message["body"]["email"] == self.user_email,
                        "Email is %s instead of '%s'" % (message["body"]["username"], self.user_email))

        self.user_id = message["body"]["_id"]["$oid"]
        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "users",
            "operation": "delete",
            "correlation": correlation,
            "body": dict(_id=self.user_id)
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=200, correlation=correlation, operation="deleted", action="users"))

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "users",
            "operation": "delete",
            "correlation": correlation,
            "body": dict(_id=self.user_id)
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=404, correlation=correlation, operation="delete", action="users", body_type=dict))

        expected_message = "users %s not found." % self.user_id
        self.assertTrue(message["body"]["message"] == expected_message,
                        "Message is %s instead of '%s'" % (message["body"]["message"], expected_message))

        connection.close()
        logging.debug("Completed create_user_test")

    @testing.gen_test(timeout=60)
    def duplicate_user_test(self):
        logging.debug("Start duplicate_user_test")

        request = yield get_ws_request(self.io_loop)
        connection = yield websocket_connect(request)

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "users",
            "operation": "create",
            "correlation": correlation,
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

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=200, correlation=correlation, operation="created", action="users", body_type=dict))

        self.assertTrue(message["body"]["email"] == self.user_email,
                        "Email is %s instead of '%s'" % (message["body"]["username"], self.user_email))

        self.user_id = message["body"]["_id"]["$oid"]
        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "users",
            "operation": "create",
            "correlation": correlation,
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

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=409, correlation=correlation, operation="create", action="users", body_type=dict))

        expected_message = "E11000 duplicate key error collection: elastickube.Users index: email_1 dup "\
            "key: { : \"%s\" }" % self.user_email

        self.assertTrue(message["body"]["message"] == expected_message,
                        "Message is %s instead of '%s'" % (message["body"]["message"], expected_message))

        logging.debug("Completed duplicate_user_test")


if __name__ == "__main__":
    testing.main()

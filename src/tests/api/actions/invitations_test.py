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
from pymongo import MongoClient
from tornado import testing
from tornado.httpclient import AsyncHTTPClient, HTTPRequest
from tornado.websocket import websocket_connect

from tests import api

ELASTICKUBE_VALIDATION_TOKEN_HEADER = "ElasticKube-Validation-Token"


class TestActionsInvitations(api.ApiTestCase):

    def _delete_user(self, email):
        database = MongoClient("mongodb://%s:27017/" % self.get_api_address()).elastickube
        database.Users.remove({"email": email})

    @testing.gen_test(timeout=60)
    def test_create_invitations(self):
        user_email = "test_%s@elasticbox.com" % str(uuid.uuid4())[:10]
        self.addCleanup(self._delete_user, user_email)

        correlation = self.send_message("invitations", "create", body={"emails": [user_email], "note": "Test note"})
        response = yield self.wait_message(self.connection, correlation)
        self.validate_response(response, 200, correlation, "created", "invitations")

        database = MongoClient("mongodb://%s:27017/" % self.get_api_address()).elastickube
        user = database.Users.find_one({"email": user_email})

        invitation_token = user["invite_token"]

        data = dict(email=user_email, password="elastickube123", firstname="firstname", lastname="lastname")
        yield AsyncHTTPClient(self.io_loop).fetch(
            "http://%s/api/v1/auth/signup" % self.get_api_address(),
            method='POST',
            headers={ELASTICKUBE_VALIDATION_TOKEN_HEADER: invitation_token},
            body=json.dumps(data))

        correlation = self.send_message("users", "watch")
        response = yield self.wait_message(self.connection, correlation)

        new_user = None
        for user in response["body"]:
            if "email" in user and user["email"] == user_email:
                new_user = user
                break

        self.assertIsNotNone(new_user)

    @testing.gen_test(timeout=60)
    def test_update_invitations(self):
        correlation = self.send_message("invitations", "update")
        response = yield self.wait_message(self.connection, correlation)
        self.validate_response(response, 405, correlation, "update", "invitations")
        self.assertTrue(isinstance(response["body"], dict), "Body is not a dict but %s" % type(response["body"]))
        self.assertTrue(response["body"]["message"] == "Operation update not supported for action invitations.",
                        "Message is %s instead of 'Operation update not supported for action invitations.'" %
                        response['body']["message"])

    @testing.gen_test(timeout=60)
    def test_delete_invitations(self):
        correlation = self.send_message("invitations", "delete")
        response = yield self.wait_message(self.connection, correlation)
        self.validate_response(response, 405, correlation, "delete", "invitations")
        self.assertTrue(isinstance(response["body"], dict), "Body is not a dict but %s" % type(response["body"]))
        self.assertTrue(response["body"]["message"] == "Operation delete not supported for action invitations.",
                        "Message is %s instead of 'Operation delete not supported for action invitations.'" %
                        response['body']["message"])

    @testing.gen_test(timeout=60)
    def test_invite_unauthorized(self):
        token = yield self.get_token("engineer@elasticbox.com", "elastickube123")
        request = HTTPRequest(
            "ws://%s/api/v1/ws" % self.get_api_address(),
            headers=dict([(api.ELASTICKUBE_TOKEN_HEADER, token)]),
            validate_cert=False
        )

        connection = yield websocket_connect(request)

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "invitations", "operation": "create", "correlation": correlation
        }))

        response = yield self.wait_message(connection, correlation)
        self.validate_response(response, 403, correlation, "create", "invitations")
        self.assertTrue(isinstance(response["body"], dict), "Body is not a dict but %s" % type(response["body"]))
        self.assertTrue(response["body"]["message"] == "Operation create forbidden for action invitations.",
                        "Message is %s instead of 'Operation create forbidden for action invitations.'" %
                        response["body"]["message"])

        connection.close()


if __name__ == "__main__":
    unittest2.main()

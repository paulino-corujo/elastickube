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

import uuid

import unittest2
from pymongo import MongoClient
from tornado import testing

from tests import api


class TestCursor(api.ApiTestCase):

    def setUp(self):
        super(TestCursor, self).setUp()

        self.db = MongoClient("mongodb://%s:27017/" % self.get_api_address()).elastickube
        self.document_to_delete = dict()

    def tearDown(self):
        for collection, documents in self.document_to_delete.iteritems():
            for document in documents:
                self.db[collection].remove({'_id': document})

        super(TestCursor, self).tearDown()

    @testing.gen_test(timeout=60)
    def test_base_cursor(self):
        for entity in ["users", "namespaces", "settings", "charts"]:
            document_id = self.db[entity.capitalize()].insert({"id": str(uuid.uuid4())})
            self.document_to_delete[entity.capitalize()] = [document_id]

            correlation = self.send_message(entity, "watch")
            response = yield self.wait_message(self.connection, correlation)
            self.validate_response(response, 200, correlation, "watched", entity)
            self.assertTrue(isinstance(response["body"], list), "Body is not a list but %s" % type(response["body"]))
            self.assertTrue(len(response["body"]) > 0, "No %s returned as part of the response" % entity)

            correlation = self.send_message(entity, "watch")
            response = yield self.wait_message(self.connection, correlation)
            self.validate_response(response, 400, correlation, "watched", entity)
            self.assertTrue(isinstance(response["body"], dict), "Body is not a dict but %s" % type(response["body"]))
            self.assertTrue(response["body"]["message"] == "Action already watched.", response)

            document_id = self.db[entity.capitalize()].insert({"id": str(uuid.uuid4())})
            self.document_to_delete[entity.capitalize()].append(document_id)
            response = yield self.wait_message(self.connection)
            self.assertTrue(response["status_code"] == 200, response)
            self.assertTrue(response["operation"] == "created", response)
            self.assertTrue(response["action"] == entity, response)

            correlation = self.send_message(entity, "unwatch")
            response = yield self.wait_message(self.connection, correlation)
            self.validate_response(response, 200, correlation, "unwatched", entity)
            self.assertTrue(isinstance(response['body'], dict), "Body is not a dict but %s" % type(response['body']))
            self.assertTrue(len(response['body'].keys()) == 0, "Body is not empty")

    @testing.gen_test(timeout=60)
    def test_wrong_entity(self):
        correlation = self.send_message("fake", "watch")
        response = yield self.wait_message(self.connection, correlation)
        self.validate_response(response, 400, correlation, "watch", "fake")
        self.assertTrue(isinstance(response["body"], dict), "Body is not a list but %s" % type(response["body"]))
        self.assertTrue(response["body"]["message"] == "Action fake not supported.",
                        "Message is %s instead of 'Action fake not supported.'" % response["body"]["message"])


if __name__ == '__main__':
    unittest2.main()

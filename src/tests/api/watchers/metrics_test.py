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


class TestWatchersMetrics(api.ApiTestCase):

    def setUp(self):
        super(TestWatchersMetrics, self).setUp()

        self.db = MongoClient("mongodb://%s:27017/" % self.get_api_address()).elastickube
        self.document_to_delete = []

    def tearDown(self):
        for document in self.document_to_delete:
            self.db["Metrics"].remove({'_id': document})

        super(TestWatchersMetrics, self).tearDown()

    @testing.gen_test(timeout=60)
    def test_watch_metrics(self):
        correlation = self.send_message("metrics", "watch", body={"kind": "Namespace"})
        response = yield self.wait_message(self.connection, correlation)
        self.validate_response(response, 200, correlation, "watched", "metrics")
        self.assertTrue(isinstance(response["body"], list), "Body is not a list but %s" % type(response["body"]))

        correlation = self.send_message("metrics", "watch", body={"kind": "Namespace"})
        response = yield self.wait_message(self.connection, correlation)
        self.validate_response(response, 400, correlation, "watched", "metrics")
        self.assertTrue(isinstance(response["body"], dict), "Body is not a dict but %s" % type(response["body"]))
        self.assertTrue(response["body"]["message"] == "Action already watched.",
                        "Message is %s instead of 'Action already watched.'" % response["body"]["message"])

        document_id = self.db["Metrics"].insert({"id": str(uuid.uuid4())})
        self.document_to_delete.append(document_id)
        response = yield self.wait_message(self.connection)
        self.assertTrue(response["status_code"] == 200, response)
        self.assertTrue(response["operation"] == "created", response)
        self.assertTrue(response["action"] == "metrics", response)

        correlation = self.send_message("metrics", "unwatch", body={"kind": "Namespace"})
        response = yield self.wait_message(self.connection, correlation)
        self.validate_response(response, 200, correlation, "unwatched", "metrics")
        self.assertTrue(isinstance(response['body'], dict), "Body is not a dict but %s" % type(response['body']))
        self.assertTrue(len(response['body'].keys()) == 0, "Body is not empty")


if __name__ == '__main__':
    unittest2.main()

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

import unittest2
from bson.objectid import ObjectId
from tornado import testing

from tests import api


class TestActionsInstances(api.ApiTestCase):

    @testing.gen_test(timeout=60)
    def test_unknown_chart(self):
        chart_id = str(ObjectId())

        correlation = self.send_message("instances", "create", body=dict(namespace="default", uid=chart_id))
        response = yield self.wait_message(self.connection, correlation)
        self.validate_response(response, 404, correlation, "create", "instances")
        self.assertTrue(isinstance(response["body"], dict), "Body is not a dict but %s" % type(response["body"]))
        self.assertTrue(response["body"]["message"] == "Cannot find Chart %s" % chart_id,
                        "Message is %s instead of 'Cannot find Chart %s'" % (response['body']["message"], chart_id))


if __name__ == "__main__":
    unittest2.main()

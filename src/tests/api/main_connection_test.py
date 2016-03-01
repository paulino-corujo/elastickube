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
from tornado.httpclient import HTTPRequest
from tornado.websocket import websocket_connect

from tests.api import ELASTICKUBE_TOKEN_HEADER


class MainConnectionTest(testing.AsyncTestCase):

    _multiprocess_can_split_ = True

    @testing.gen_test(timeout=60)
    def main_connection_test(self):
        logging.debug("Start main_connection_test")

        request = HTTPRequest(
            "ws://localhost/api/v1/ws",
            headers=dict([(ELASTICKUBE_TOKEN_HEADER, 'fake_token')]),
            validate_cert=False
        )

        connection = yield websocket_connect(request)
        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "charts",
            "operation": "watch",
            "correlation": correlation
        }))

        deserialized_message = None
        while True:
            message = yield connection.read_message()
            deserialized_message = json.loads(message)
            if deserialized_message:
                break

        self.assertTrue(isinstance(deserialized_message, dict),
                        "Body is not a dict but %s" % type(deserialized_message))
        expected_message = "Cannot open connection"
        self.assertTrue(deserialized_message["error"]["message"] == expected_message,
                        "Message is %s instead of '%s'" % (deserialized_message["error"]["message"], expected_message))
        connection.close()

        logging.debug("Completed main_connection_test")


if __name__ == "__main__":
    testing.main()

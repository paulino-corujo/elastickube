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

from tests.api import get_token, wait_message, ELASTICKUBE_TOKEN_HEADER


class ActionsUserTests(testing.AsyncTestCase):

    _multiprocess_can_split_ = True

    @testing.gen_test(timeout=60)
    def create_setting_test(self):
        logging.debug("Start create_setting_test")

        token = yield get_token(self.io_loop)
        request = HTTPRequest(
            "ws://localhost/api/v1/ws",
            headers=dict([(ELASTICKUBE_TOKEN_HEADER, token)]),
            validate_cert=False
        )

        connection = yield websocket_connect(request)
        connection.write_message(json.dumps({
            "action": "settings",
            "operation": "create",
            "correlation": 123,
            "body": dict()
        }))

        message = yield connection.read_message()
        deserialized_message = json.loads(message)

        self.assertTrue(deserialized_message["status_code"] == 405,
                        "Status code is %d instead of 405" % deserialized_message["status_code"])
        self.assertTrue(deserialized_message["correlation"] == 123,
                        "Correlation is %d instead of 123" % deserialized_message["correlation"])
        self.assertTrue(deserialized_message["operation"] == "create",
                        "Operation is %s instead of create" % deserialized_message["operation"])
        self.assertTrue(deserialized_message["action"] == "settings",
                        "Action is %s instead of settings" % deserialized_message["action"])
        self.assertTrue(isinstance(deserialized_message["body"], dict),
                        "Body is not a dict but %s" % type(deserialized_message["body"]))

        expected_message = "Operation create not supported for action settings."
        self.assertTrue(deserialized_message["body"]["message"] == expected_message,
                        "Message is %s instead of '%s'" % (deserialized_message["body"]["message"], expected_message))

        connection.close()
        logging.debug("Completed create_setting_test")

    @testing.gen_test(timeout=60)
    def update_setting_test(self):
        logging.debug("Start update_setting_test")

        token = yield get_token(self.io_loop)
        request = HTTPRequest(
            "ws://localhost/api/v1/ws",
            headers=dict([(ELASTICKUBE_TOKEN_HEADER, token)]),
            validate_cert=False
        )

        connection = yield websocket_connect(request)

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "settings",
            "operation": "watch",
            "correlation": correlation
        }))

        deserialized_message = yield wait_message(connection, correlation)
        self.assertTrue(deserialized_message["status_code"] == 200,
                        "Status code is %d instead of 200" % deserialized_message["status_code"])
        self.assertTrue(deserialized_message["correlation"] == correlation,
                        "Correlation is %s instead of %s" % (deserialized_message["correlation"], correlation))
        self.assertTrue(deserialized_message["operation"] == "watched",
                        "Operation is %s instead of watched" % deserialized_message["operation"])
        self.assertTrue(deserialized_message["action"] == "settings",
                        "Action is %s instead of settings" % deserialized_message["action"])
        self.assertTrue(isinstance(deserialized_message["body"], list),
                        "Body is not a list but %s" % type(deserialized_message["body"]))
        self.assertTrue(len(deserialized_message["body"]) > 0, "No Settings returned as part of the response")
        self.assertTrue(len(deserialized_message["body"]) < 2, "Multiple Settings returned as part of the response")

        settings = deserialized_message["body"][0]

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "settings",
            "operation": "update",
            "correlation": correlation,
            "body": settings
        }))

        deserialized_message = yield wait_message(connection, correlation)
        self.assertTrue(deserialized_message["status_code"] == 200,
                        "Status code is %d instead of 200" % deserialized_message["status_code"])
        self.assertTrue(deserialized_message["correlation"] == correlation,
                        "Correlation is %s instead of %s" % (deserialized_message["correlation"], correlation))
        self.assertTrue(deserialized_message["operation"] == "updated",
                        "Operation is %s instead of updated" % deserialized_message["operation"])
        self.assertTrue(deserialized_message["action"] == "settings",
                        "Action is %s instead of settings" % deserialized_message["action"])
        self.assertTrue(isinstance(deserialized_message["body"], dict),
                        "Body is not a dict but %s" % type(deserialized_message["body"]))
        previous_version = settings["metadata"]["resourceVersion"]
        self.assertTrue(deserialized_message["body"]["metadata"]["resourceVersion"] > previous_version,
                        "resourceVersion is equal or lower than before, %s %s  " % (
                            previous_version, deserialized_message["body"]["metadata"]["resourceVersion"]))

        connection.close()
        logging.debug("Completed update_setting_test")

    @testing.gen_test(timeout=60)
    def delete_setting_test(self):
        logging.debug("Start delete_setting_test")

        token = yield get_token(self.io_loop)
        request = HTTPRequest(
            "ws://localhost/api/v1/ws",
            headers=dict([(ELASTICKUBE_TOKEN_HEADER, token)]),
            validate_cert=False
        )

        connection = yield websocket_connect(request)
        connection.write_message(json.dumps({
            "action": "settings",
            "operation": "delete",
            "correlation": 123,
            "body": dict()
        }))

        message = yield connection.read_message()
        deserialized_message = json.loads(message)

        self.assertTrue(deserialized_message["status_code"] == 405,
                        "Status code is %d instead of 405" % deserialized_message["status_code"])
        self.assertTrue(deserialized_message["correlation"] == 123,
                        "Correlation is %d instead of 123" % deserialized_message["correlation"])
        self.assertTrue(deserialized_message["operation"] == "delete",
                        "Operation is %s instead of delete" % deserialized_message["operation"])
        self.assertTrue(deserialized_message["action"] == "settings",
                        "Action is %s instead of settings" % deserialized_message["action"])
        self.assertTrue(isinstance(deserialized_message["body"], dict),
                        "Body is not a dict but %s" % type(deserialized_message["body"]))

        expected_message = "Operation delete not supported for action settings."
        self.assertTrue(deserialized_message["body"]["message"] == expected_message,
                        "Message is %s instead of '%s'" % (deserialized_message["body"]["message"], expected_message))

        connection.close()
        logging.debug("Completed delete_setting_test")

    @testing.gen_test(timeout=60)
    def forbidden_update_test(self):
        logging.debug("Start forbidden_update_test")

        token = yield get_token(self.io_loop, username="engineer@elasticbox.com")
        request = HTTPRequest(
            "ws://localhost/api/v1/ws",
            headers=dict([(ELASTICKUBE_TOKEN_HEADER, token)]),
            validate_cert=False
        )

        connection = yield websocket_connect(request)
        connection.write_message(json.dumps({
            "action": "settings",
            "operation": "update",
            "correlation": 123,
            "body": dict()
        }))

        message = yield connection.read_message()
        deserialized_message = json.loads(message)

        self.assertTrue(deserialized_message["status_code"] == 403,
                        "Status code is %d instead of 405" % deserialized_message["status_code"])
        self.assertTrue(deserialized_message["correlation"] == 123,
                        "Correlation is %d instead of 123" % deserialized_message["correlation"])
        self.assertTrue(deserialized_message["operation"] == "update",
                        "Operation is %s instead of delete" % deserialized_message["operation"])
        self.assertTrue(deserialized_message["action"] == "settings",
                        "Action is %s instead of settings" % deserialized_message["action"])
        self.assertTrue(isinstance(deserialized_message["body"], dict),
                        "Body is not a dict but %s" % type(deserialized_message["body"]))

        expected_message = "Operation update forbidden for action settings."
        self.assertTrue(deserialized_message["body"]["message"] == expected_message,
                        "Message is %s instead of '%s'" % (deserialized_message["body"]["message"], expected_message))

        connection.close()
        logging.debug("Completed forbidden_update_test")


if __name__ == "__main__":
    testing.main()

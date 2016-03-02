import json
import logging
import uuid

from tornado import testing
from tornado.websocket import websocket_connect

from tests.api import wait_message, get_ws_request, validate_response


class ActionsSettingsTests(testing.AsyncTestCase):

    _multiprocess_can_split_ = True

    @testing.gen_test(timeout=60)
    def create_settings_test(self):
        logging.debug("Start create_settings_test")

        request = yield get_ws_request(self.io_loop)
        connection = yield websocket_connect(request)

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "settings",
            "operation": "create",
            "correlation": correlation,
            "body": dict()
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=405, correlation=correlation, operation="create", action="settings", body_type=dict))

        expected_message = "Operation create not supported for action settings."
        self.assertTrue(message["body"]["message"] == expected_message,
                        "Message is %s instead of '%s'" % (message["body"]["message"], expected_message))

        connection.close()
        logging.debug("Completed create_settings_test")

    @testing.gen_test(timeout=60)
    def update_settings_test(self):
        logging.debug("Start update_settings_test")

        request = yield get_ws_request(self.io_loop)
        connection = yield websocket_connect(request)

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "settings",
            "operation": "watch",
            "correlation": correlation
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=200, correlation=correlation, operation="watched", action="settings", body_type=list))

        self.assertTrue(len(message["body"]) > 0, "No Settings returned as part of the response")
        self.assertTrue(len(message["body"]) < 2, "Multiple Settings returned as part of the response")

        settings = message["body"][0]

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "settings",
            "operation": "update",
            "correlation": correlation,
            "body": settings
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=200, correlation=correlation, operation="updated", action="settings", body_type=dict))

        previous_version = settings["metadata"]["resourceVersion"]
        self.assertTrue(message["body"]["metadata"]["resourceVersion"] > previous_version,
                        "resourceVersion is equal or lower than before, %s %s  " % (
                            previous_version, message["body"]["metadata"]["resourceVersion"]))

        connection.close()
        logging.debug("Completed update_settings_test")

    @testing.gen_test(timeout=60)
    def delete_settings_test(self):
        logging.debug("Start delete_settings_test")

        request = yield get_ws_request(self.io_loop)
        connection = yield websocket_connect(request)

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "settings",
            "operation": "delete",
            "correlation": correlation,
            "body": dict()
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=405, correlation=correlation, operation="delete", action="settings", body_type=dict))

        expected_message = "Operation delete not supported for action settings."
        self.assertTrue(message["body"]["message"] == expected_message,
                        "Message is %s instead of '%s'" % (message["body"]["message"], expected_message))

        connection.close()
        logging.debug("Completed delete_settings_test")

    @testing.gen_test(timeout=60)
    def forbidden_update_test(self):
        logging.debug("Start forbidden_update_test")

        request = yield get_ws_request(self.io_loop, username="engineer@elasticbox.com")
        connection = yield websocket_connect(request)

        correlation = str(uuid.uuid4())[:10]
        connection.write_message(json.dumps({
            "action": "settings",
            "operation": "update",
            "correlation": correlation,
            "body": dict()
        }))

        message = yield wait_message(connection, correlation)
        validate_response(
            self,
            message,
            dict(status_code=403, correlation=correlation, operation="update", action="settings", body_type=dict))

        expected_message = "Operation update forbidden for action settings."
        self.assertTrue(message["body"]["message"] == expected_message,
                        "Message is %s instead of '%s'" % (message["body"]["message"], expected_message))

        connection.close()
        logging.debug("Completed forbidden_update_test")


if __name__ == "__main__":
    testing.main()

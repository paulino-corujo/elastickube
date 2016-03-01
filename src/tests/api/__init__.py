import json

from tornado.gen import coroutine, Return
from tornado.httpclient import AsyncHTTPClient, HTTPRequest

ELASTICKUBE_TOKEN_HEADER = "ElasticKube-Token"


@coroutine
def get_token(io_loop, username="operations@elasticbox.com", password="elastickube123"):
    response = yield AsyncHTTPClient(io_loop).fetch(
        "http://localhost/api/v1/auth/login",
        method="POST",
        body=json.dumps(dict(username=username, password=password)))

    raise Return(response.body)


@coroutine
def get_ws_request(io_loop, username="operations@elasticbox.com", password="elastickube123"):
    token = yield get_token(io_loop, username, password)
    request = HTTPRequest(
        "ws://localhost/api/v1/ws",
        headers=dict([(ELASTICKUBE_TOKEN_HEADER, token)]),
        validate_cert=False
    )

    raise Return(request)


@coroutine
def wait_message(connection, correlation):
    deserialized_message = None
    while True:
        message = yield connection.read_message()
        deserialized_message = json.loads(message)
        if "correlation" in deserialized_message and deserialized_message["correlation"] == correlation:
            break

    raise Return(deserialized_message)


def validate_response(test_case, message, expected_result):
    test_case.assertTrue(message["status_code"] == expected_result["status_code"],
                         "Status code is %d instead of %d" % (message["status_code"], expected_result["status_code"]))
    test_case.assertTrue(message["correlation"] == expected_result["correlation"],
                         "Correlation is %s instead of %s" % (message["correlation"], expected_result["correlation"]))
    test_case.assertTrue(message["operation"] == expected_result["operation"],
                         "Operation is %s instead of %s" % (message["operation"], expected_result["operation"]))
    test_case.assertTrue(message["action"] == expected_result["action"],
                         "Action is %s instead of %s" % (message["action"], expected_result["action"]))
    test_case.assertTrue(isinstance(message["body"], expected_result["body_type"]),
                         "Body is not a %s but %s" % (expected_result["body_type"], type(message["body"])))

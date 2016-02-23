import json

from tornado.gen import coroutine, Return
from tornado.httpclient import AsyncHTTPClient

ELASTICKUBE_TOKEN_HEADER = "ElasticKube-Token"


@coroutine
def get_token(io_loop, username="operations@elasticbox.com", password="elastickube"):
    response = yield AsyncHTTPClient(io_loop).fetch(
        "http://localhost/api/v1/auth/login",
        method="POST",
        body=json.dumps(dict(username=username, password=password)))

    raise Return(response.body)


@coroutine
def wait_message(connection, correlation):
    deserialized_message = None
    while True:
        message = yield connection.read_message()
        deserialized_message = json.loads(message)
        if "correlation" in deserialized_message and deserialized_message["correlation"] == correlation:
            break

    raise Return(deserialized_message)

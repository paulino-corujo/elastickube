import json
import logging

from tornado.gen import coroutine, Return
from tornado.httpclient import AsyncHTTPClient
from tornado.testing import AsyncTestCase

ELASTICKUBE_TOKEN_HEADER = "ElasticKube-Token"
CONTENT_TYPE_HEADER = "Content-Type"
CONTENT_TYPE_JSON = "application/json"

TOKEN = {}


class ApiAsyncTestCase(AsyncTestCase):

    _multiprocess_can_split_ = True

    def setUp(self):
        super(ApiAsyncTestCase, self).setUp()

        self.http_client = AsyncHTTPClient(self.io_loop)
        self.base_url = "http://localhost"

    @coroutine
    def get(self, url, username='operations@elasticbox.com', password='elastickube'):
        if username in TOKEN:
            token = TOKEN[username]
        else:
            token = yield self.get_token(username, password)
            TOKEN[username] = token

        response = yield self.http_client.fetch(url, method="GET", headers={ELASTICKUBE_TOKEN_HEADER: token})
        if (CONTENT_TYPE_HEADER in response.headers.keys() and
                response.headers[CONTENT_TYPE_HEADER] == CONTENT_TYPE_JSON):
            raise Return(json.loads(response.body))
        else:
            raise Return(response.body)

    @coroutine
    def get_token(self, username, password):
        logging.debug('Getting token for user: {0}'.format(username))
        login_url = self.base_url + '/api/v1/login'

        response = yield self.http_client.fetch(
            login_url, method='POST', body=json.dumps(dict(username=username, password=password)))

        raise Return(response.body)

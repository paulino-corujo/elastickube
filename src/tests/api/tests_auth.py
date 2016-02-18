import json
import logging

from motor.motor_tornado import MotorClient
from tornado import testing
from tornado.gen import coroutine
from tornado.httpclient import HTTPError, AsyncHTTPClient

from api.db.query import Query

class AuthTests(testing.AsyncTestCase):

    def setUp(self):
        super(AuthTests, self).setUp()

        self.database = MotorClient("mongodb://localhost:27017/").elastickube
        self.existing_users = []

    @coroutine
    def tearDown(self):
        for existing_user in self.existing_users:
            existing_user['deleted'] = None
            yield self.database['Users'].update({"_id": existing_user['_id']}, existing_user)

    @testing.gen_test
    def test_auth_providers(self):
        logging.debug("Start test_auth_providers")

        response = yield AsyncHTTPClient(self.io_loop).fetch("http://localhost/api/v1/auth/providers")
        auth_providers = json.loads(response.body)
        self.assertTrue(len(auth_providers.keys()) >= 1, "No auth methods enabled %s" % auth_providers)

        if "password" in auth_providers:
            self.assertTrue(
                "regex" in auth_providers["password"],
                "Missing property 'regex' in auth password method %s" % auth_providers
            )

        logging.debug("Completed test_auth_providers")

    @testing.gen_test
    def test_no_auth_providers(self):
        logging.debug("Start test_no_auth_providers")

        self.existing_users = yield Query(self.database, "Users").find()
        for existing_user in self.existing_users:
            existing_user['deleted'] = 'deleted'
            yield Query(self.database, "Users").update(existing_user)

        response = yield AsyncHTTPClient(self.io_loop).fetch("http://localhost/api/v1/auth/providers")
        auth_providers = json.loads(response.body)
        self.assertTrue(len(auth_providers.keys()) == 0, "Auth methods enabled %s" % auth_providers)

        logging.debug("Completed test_no_auth_providers")

    @testing.gen_test
    def test_signup_disabled(self):
        logging.debug("Start test_signup_disabled")

        error = None
        try:
            yield AsyncHTTPClient(self.io_loop).fetch(
                "http://localhost/api/v1/auth/signup",
                method="POST",
                body=json.dumps({})
            )
        except HTTPError as e:
            error = e

        self.assertIsNotNone(error, "No error raise calling /api/v1/auth/signup")
        self.assertEquals(error.code, 403, "/api/v1/auth/signup raised %d instead of 403" % error.code)

        logging.debug("Completed test_signup_disabled")

if __name__ == '__main__':
    testing.main()

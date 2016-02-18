import os
import sys
import logging

from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.netutil import bind_unix_socket
from tornado.web import Application

from api.v1 import initialize
from api.v1.main import MainWebSocketHandler
from api.v1.auth import AuthProvidersHandler, SignupHandler, PasswordHandler, GoogleOAuth2LoginHandler


logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)


if __name__ == "__main__":

    # FIXME: generate a random SALT when initializing DB
    settings = dict(
        autoreload=True,
        secret="ElasticKube",
    )

    initialize(settings)

    handlers = [
        (r"/api/v1/auth/providers", AuthProvidersHandler),
        (r"/api/v1/auth/signup", SignupHandler),
        (r"/api/v1/auth/login", PasswordHandler),
        (r"/api/v1/auth/google", GoogleOAuth2LoginHandler),
        (r"/api/v1/ws", MainWebSocketHandler)
    ]

    application = Application(handlers, **settings)

    server = HTTPServer(application)
    socket = bind_unix_socket("/var/run/elastickube-api.sock", mode=0777)
    server.add_socket(socket)
    IOLoop.current().start()

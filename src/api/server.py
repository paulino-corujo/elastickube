import sys
import logging

from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.netutil import bind_unix_socket
from tornado.web import Application

from api.v1 import configure, initialize
from api.v1.main import MainWebSocketHandler
from api.v1.auth import AuthProvidersHandler, SignupHandler, PasswordHandler, GoogleOAuth2LoginHandler


logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)

# Config tornado.curl_httpclient to use NullHandler
tornado_logger = logging.getLogger('tornado.curl_httpclient')
tornado_logger.addHandler(logging.NullHandler())
tornado_logger.propagate = False


if __name__ == "__main__":

    # FIXME: generate a random SALT when initializing DB
    settings = dict(
        autoreload=True,
        secret="ElasticKube",
    )

    configure(settings)

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

    IOLoop.current().add_callback(initialize, settings)
    IOLoop.current().start()

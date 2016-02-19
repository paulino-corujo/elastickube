import sys
import logging

from tornado import autoreload
from tornado.ioloop import IOLoop
from charts.sync import initialize


logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)

if __name__ == "__main__":
    autoreload.start()

    IOLoop.current().add_callback(initialize)
    IOLoop.current().start()
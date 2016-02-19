import logging
import os

from data.watch import add_callback, remove_callback
from charts.sync.git import GitSync
from motor.motor_tornado import MotorClient
from tornado.gen import coroutine, Return


@coroutine
def initialize():
    logging.info("Initializing charts sync.")
    mongo_url = "mongodb://{0}:{1}/".format(
        os.getenv('ELASTICKUBE_MONGO_SERVICE_HOST', 'localhost'),
        os.getenv('ELASTICKUBE_MONGO_SERVICE_PORT', 27017)
    )

    settings = dict()
    settings['motor'] = MotorClient(mongo_url)
    settings['database'] = settings['motor'].elastickube

    GitSync(settings)

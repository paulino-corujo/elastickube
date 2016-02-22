import logging
import os


from charts.sync.repo import GitSync
from motor.motor_tornado import MotorClient
from tornado.gen import coroutine, Return


@coroutine
def initialize():
    logging.info("Initializing charts sync")

    mongo_url = "mongodb://{0}:{1}/".format(
        os.getenv('ELASTICKUBE_MONGO_SERVICE_HOST', 'localhost'),
        os.getenv('ELASTICKUBE_MONGO_SERVICE_PORT', 27017)
    )

    settings = dict()
    settings['motor'] = MotorClient(mongo_url)
    settings['database'] = settings['motor'].elastickube
    settings['repo'] = 'https://github.com/helm/charts.git'

    yield GitSync(settings).sync()


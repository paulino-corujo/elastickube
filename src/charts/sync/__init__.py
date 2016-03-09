import logging
import os

from motor.motor_tornado import MotorClient
from tornado.gen import coroutine, Return, sleep

from charts.sync.repo import GitSync
from data import watch


@coroutine
def initialize():
    logging.info("Initializing charts sync")

    mongo_url = "mongodb://{0}:{1}/".format(
        os.getenv("ELASTICKUBE_MONGO_SERVICE_HOST", "localhost"),
        os.getenv("ELASTICKUBE_MONGO_SERVICE_PORT", 27017)
    )

    motor_client = MotorClient(mongo_url)

    watch.start_monitor(motor_client)
    yield GitSync(motor_client.elastickube).sync_loop()

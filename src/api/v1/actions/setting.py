import logging
from datetime import datetime

from bson.objectid import ObjectId
from tornado.gen import coroutine, Return

from data.query import Query, ObjectNotFoundException


class SettingActions(object):

    def __init__(self, settings):
        logging.info("Initializing SettingActions")
        self.database = settings['database']

    @coroutine
    def create(self, document):
        logging.info("Creating Setting")

        setting = yield Query(self.database, "Settings").insert(document)
        raise Return(setting)

    @coroutine
    def update(self, document):
        logging.info("Updating Setting")

        setting = yield Query(self.database, "Settings").update(document)

        raise Return(setting)

    @coroutine
    def delete(self, setting_id):
        logging.info("Deleting Setting %s", setting_id)

        setting = yield Query(self.database, "Settings").find_one({"_id": ObjectId(setting_id)})
        if setting is not None:
            setting['deleted'] = datetime.utcnow().isoformat()
            yield Query(self.database, "Settings").update(setting)
        else:
            raise ObjectNotFoundException()

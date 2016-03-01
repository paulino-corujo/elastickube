import logging

from tornado.gen import coroutine, Return

from data.query import Query


class SettingActions(object):

    def __init__(self, settings):
        logging.info("Initializing SettingActions")
        self.database = settings['database']

    def check_permissions(self, user, _operation, _body):
        if user['role'] == 'administrator':
            return True
        else:
            return False

    @coroutine
    def update(self, document):
        logging.info("Updating Setting document with _id: %s", document["_id"])

        setting = yield Query(self.database, "Settings").update(document)
        raise Return(setting)

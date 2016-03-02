import logging

from tornado.gen import coroutine, Return

from data.query import Query


class SettingsActions(object):

    def __init__(self, settings):
        logging.info("Initializing SettingsActions")
        self.database = settings['database']

    @staticmethod
    def check_permissions(user, operation):
        logging.debug("Checking permissions for user %s and operation %s on settings", user["username"], operation)
        if user['role'] == 'administrator':
            return True
        else:
            return False

    @coroutine
    def update(self, document):
        logging.info("Updating Setting document with _id: %s", document["_id"])

        setting = yield Query(self.database, "Settings").update(document)
        raise Return(setting)

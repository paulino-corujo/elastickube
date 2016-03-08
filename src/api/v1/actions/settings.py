import logging

from tornado.gen import coroutine, Return

from data.query import Query


class SettingsActions(object):

    def __init__(self, settings, user):
        logging.info("Initializing SettingsActions")

        self.database = settings['database']
        self.user = user

    def check_permissions(self, operation, _document):
        logging.debug("check_permissions for user %s and operation %s on settings", self.user["username"], operation)
        return self.user['role'] == 'administrator'

    @coroutine
    def update(self, document):
        logging.info("Updating Setting document with _id: %s", document["_id"])

        setting = yield Query(self.database, "Settings").update(document)
        raise Return(setting)

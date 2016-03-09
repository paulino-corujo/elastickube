"""
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

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

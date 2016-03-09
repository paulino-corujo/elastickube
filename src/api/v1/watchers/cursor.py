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
from data.watch import add_callback, remove_callback

ACTIONS_METADATA = {
    "users": {
        "collection": "Users",
        "projection": {"password": 0}
    },
    "namespaces": {
        "collection": "Namespaces",
        "projection": None
    },
    "settings": {
        "collection": "Settings",
        "projection": None
    },
    "charts": {
        "collection": "Charts",
        "projection": None
    }
}


class CursorWatcher(object):

    def __init__(self, message, settings, callback):
        logging.info("Initializing CursorWatcher")

        self.callback = callback
        self.message = message
        self.settings = settings

        self.validate_message()

    @coroutine
    def watch(self):
        action = self.message["action"]
        logging.info("Starting watch for collection %s", ACTIONS_METADATA[action]["collection"])

        data = yield Query(self.settings["database"], ACTIONS_METADATA[action]["collection"]).find(
            projection=ACTIONS_METADATA[action]["projection"])

        self.callback(dict(
            action=self.message["action"],
            operation="watched",
            correlation=self.message["correlation"],
            status_code=200,
            body=data
        ))

        add_callback(ACTIONS_METADATA[self.message["action"]]["collection"], self.data_callback)

    @coroutine
    def data_callback(self, document):
        logging.info("CursorWatcher for collection %s data_callback",
                     ACTIONS_METADATA[self.message["action"]]["collection"])

        operation = "updated"
        if document["op"] == "i":
            operation = "created"
        elif document["op"] == "d":
            operation = "deleted"

        if ACTIONS_METADATA[self.message["action"]]["projection"]:
            for key in ACTIONS_METADATA[self.message["action"]]["projection"].iterkeys():
                if key in document["o"]:
                    del document["o"][key]

        self.callback(dict(
            action=self.message["action"],
            operation=operation,
            status_code=200,
            body=document["o"]
        ))

        raise Return()

    def unwatch(self):
        logging.info("Stopping watch for collection %s", ACTIONS_METADATA[self.message["action"]]["collection"])
        remove_callback(ACTIONS_METADATA[self.message["action"]]["collection"], self.data_callback)

    def validate_message(self):
        if self.message["action"] not in ACTIONS_METADATA.keys():
            self.callback(dict(
                action=self.message["action"],
                operation=self.message["operation"],
                correlation=self.message["correlation"],
                body={"message": "Action %s not supported by CursorWatcher" % self.message["action"]},
                status_code=400
            ))

            raise RuntimeError()

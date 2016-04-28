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

from api.v1.watchers.cursor import CursorWatcher
from data.query import Query


class MetricsWatcher(CursorWatcher):

    @coroutine
    def check_permissions(self, operation, _document):
        logging.debug("check_permissions for user %s and operation %s on db watch", self.user["username"], operation)

        if self.user["role"] != "administrator":
            if "name" not in self.message["body"]:
                raise Return(False)

            namespace = yield Query(self.settings["database"], "Namespaces").find_one(
                {"name": self.message["body"]["name"]})
            if self.user["username"] not in namespace["members"]:
                raise Return(False)

        if "name" in self.message["body"]:
            self._params["name"] = self.message["body"]["name"]

        raise Return(True)

    def validate_message(self):
        super(MetricsWatcher, self).validate_message()

        if "body" not in self.message:
            self.callback(dict(
                action=self.message["action"],
                operation=self.message["operation"],
                correlation=self.message["correlation"],
                body={"message": "Missing body in request %s" % self.message},
                status_code=400
            ))

            raise RuntimeError()

        if "kind" not in self.message["body"]:
            self.callback(dict(
                action=self.message["action"],
                operation=self.message["operation"],
                correlation=self.message["correlation"],
                body={"message": "Missing kind parameter in request body %s" % self.message["body"]},
                status_code=400
            ))

            raise RuntimeError()
        else:
            self._params["kind"] = self.message["body"]["kind"]

        if self._params["kind"] != "Namespace":
            self.callback(dict(
                action=self.message["action"],
                operation=self.message["operation"],
                correlation=self.message["correlation"],
                body={"message": "kind %s is not supported" % self._params["kind"]},
                status_code=400
            ))

            raise RuntimeError()

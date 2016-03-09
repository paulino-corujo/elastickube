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


class NamespacesActions(object):

    def __init__(self, settings, user):
        logging.info("Initializing NamespacesActions")

        self.kube = settings['kube']
        self.database = settings["database"]
        self.user = user

    def check_permissions(self, operation, _document):
        logging.debug("check_permissions for user %s and operation %s on namespaces", self.user["username"], operation)
        return True

    @coroutine
    def create(self, namespace):
        logging.info("Creating namespace")
        body = {
            'kind': 'Namespace',
            'apiVersion': 'v1',
            'metadata': {
                'name': namespace['name'],
                'labels': [
                    {'name': namespace['name']}
                ]
            }
        }
        response = yield self.kube.namespaces.post(body)
        raise Return(response)

    @coroutine
    def update(self, document):
        logging.info("Updating namespace")

        user = yield Query(self.database, "Users").find_one(document['_id'])
        yield Query(self.database, "Users").update(user)

        raise Return(user)

    @coroutine
    def delete(self, document):
        logging.info("Deleting namespace")

        namespace = yield Query(self.database, "Namespaces").find_one(document["_id"])
        raise Return(namespace)

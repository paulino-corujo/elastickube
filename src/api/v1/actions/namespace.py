import logging

from data.query import Query
from datetime import datetime
from tornado.gen import coroutine, Return


class NamespaceActions(object):

    def __init__(self, settings):
        logging.info("Initializing UserActions")
        self.kube_client = settings['kube']

    def check_permissions(self, user, operation, body):
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

        response = self.kube_client.namespaces.post(body)
        raise Return(response)

    @coroutine
    def update(self, document):
        logging.info("Updating namespace")

        user = yield Query(self.database, "Users").find_one(document['_id'])
        yield Query(self.database, "Users").save(user)

        raise Return(user)

    @coroutine
    def delete(self, namespace_id):
        logging.info("Deleting namespace")

        user = yield Query(self.database, "Users").find_one(namespace_id)
        user['deleted'] = datetime.now()

        yield Query(self.database, "Users").save(user)

        raise Return(user)

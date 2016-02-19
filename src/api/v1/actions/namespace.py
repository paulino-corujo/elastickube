import logging

from data.query import Query
from datetime import datetime
from tornado.gen import coroutine, Return


class NamespaceActions(object):

    def __init__(self, message, settings):
        logging.info("Initializing UserActions")
        self.kube_client = settings['kube']

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
        logging.info("Updating userr")

        user = yield Query(self.database, "Users").find_one(document['_id'])
        user['firstname'] = document['firstname']
        user['lastname'] = document['lastname']

        yield Query(self.database, "Users").save(user)

        raise Return(user)

    @coroutine
    def delete(self):
        logging.info("Deleting userr")

        user = yield Query(self.database, "Users").find_one(document['_id'])
        user['deleted'] = datetime.now()

        yield Query(self.database, "Users").save(user)

        raise Return(user)

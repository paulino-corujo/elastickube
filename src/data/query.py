import time

from tornado.gen import coroutine, Return


class ObjectNotFoundException(Exception):
    pass


class Query(object):

    def __init__(self, database, collection):
        self.database = database
        self.collection = collection

        self.default_criteria = {"$and": [{"deleted": None}]}

    def _generate_query(self, criteria):
        query = self.default_criteria
        if criteria:
            if len(criteria) > 1:
                for key, value in criteria.iteritems():
                    query['$and'].append({key: value})
            else:
                query['$and'].append(criteria)

        return query

    @coroutine
    def find_one(self, criteria=None):
        document = yield self.database[self.collection].find_one(self._generate_query(criteria))
        raise Return(document)

    @coroutine
    def find(self, criteria=None):
        documents = []

        cursor = self.database[self.collection].find(self._generate_query(criteria))
        while (yield cursor.fetch_next):
            documents.append(cursor.next_object())

        raise Return(documents)

    @coroutine
    def insert(self, document):
        document["metadata"] = dict(resourceVersion=time.time())
        document["deleted"] = None

        document_id = yield self.database[self.collection].insert(document)
        inserted_document = yield self.database[self.collection].find_one({"_id": document_id})
        raise Return(inserted_document)

    @coroutine
    def update(self, document):
        document["metadata"] = dict(resourceVersion=time.time())

        response = yield self.database[self.collection].update({"_id": document["_id"]}, document)
        raise Return(response)

    @coroutine
    def remove(self, document):
        response = yield self.database[self.collection].remove({"_id": document["_id"]})
        raise Return(response)
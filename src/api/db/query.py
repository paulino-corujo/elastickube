from datetime import datetime

from tornado.gen import coroutine, Return


class Query(object):

    def __init__(self, database, collection):
        self.database = database
        self.collection = collection

        self.default_criteria = {'$and': [{'deleted': None}]}

    def _generate_query(self, criteria):
        query = self.default_criteria
        if criteria:
            if len(criteria) > 1:
                for key, value in criteria.iteritems():
                    query.append({key: value})
            else:
                query.append(criteria)

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
        document['created'] = datetime.utcnow().isoformat()
        document['updated'] = datetime.utcnow().isoformat()
        document['deleted'] = None

        document_id = yield self.database[self.collection].insert(document)
        inserted_document = yield self.database[self.collection].find_one({"_id": document_id})
        raise Return(inserted_document)

    @coroutine
    def update(self, document):
        document['updated'] = datetime.utcnow().isoformat()

        response = yield self.database[self.collection].update({"_id": document['_id']}, document)
        raise Return(response)

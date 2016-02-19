import time

from pymongo.errors import DuplicateKeyError
from tornado.gen import coroutine, Return


class DatastoreDuplicateKeyException(Exception):

    def __init__(self, error, collection):
        Exception.__init__(self, self._generate_message(error, collection))

    def _generate_message(self, error, collection):
        duplicates = {}
        if isinstance(error, DuplicateKeyError):
            split_error = str(error.message).split(" index: ")[1].split(" dup key: { :")
            keys = [key.rstrip("-_").lstrip("_") for key in split_error[0].split("1") if key != ""]
            values = [value.rstrip(" }").lstrip().strip('"') for value in split_error[1].split(", :") if value != ""]
            duplicates = dict(zip(keys, values))

        if len(duplicates.keys()) == 0:
            return error.message
        elif len(duplicates.keys()) == 1:
            return "%s object with %s %s already exists" % (
                collection, str(duplicates.keys()[0]), str(duplicates.values()[0]))
        else:
            formatted_duplicates = ', '.join(["%s = %s" % (k, v) for (k, v) in duplicates.iteritems()])
            return '%s object already exists with the following keys: %s' % (collection, formatted_duplicates)


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

        try:
            document_id = yield self.database[self.collection].insert(document)
        except DuplicateKeyError as e:
            raise DatastoreDuplicateKeyException(e, self.collection)

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
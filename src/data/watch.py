"""
ElasticBox Confidential
Copyright (c) 2016 All Right Reserved, ElasticBox Inc.

NOTICE:  All information contained herein is, and remains the property
of ElasticBox. The intellectual and technical concepts contained herein are
proprietary and may be covered by U.S. and Foreign Patents, patents in process,
and are protected by trade secret or copyright law. Dissemination of this
information or reproduction of this material is strictly forbidden unless prior
written permission is obtained from ElasticBox
"""

import pymongo
import logging

from tornado.gen import coroutine, Return


WATCHABLE_OPERATIONS = ['i', 'u']
WATCHABLE_COLLECTIONS = [
    "elastickube.Users",
    "elastickube.Namespaces",
    "elastickube.Settings",
    "elastickube.Charts"
]

_callbacks = dict()


@coroutine
def add_callback(collection, coroutine_callback):
    logging.info("Adding elastikube.%s callback", collection)

    namespace = "elastickube.%s" % collection
    if namespace in _callbacks:
        _callbacks[namespace].append(coroutine_callback)
    else:
        _callbacks[namespace] = [coroutine_callback]

    raise Return()


@coroutine
def remove_callback(namespace, coroutine_callback):
    if coroutine_callback in _callbacks[namespace]:
        logging.info("Removing callback from %s namespace.", namespace)
        _callbacks[namespace].remove(coroutine_callback)

    raise Return()


@coroutine
def start_monitor(client):
    logging.info("Initializing watcher...")

    try:
        oplog = client["local"]["oplog.rs"]

        cursor = oplog.find().sort('ts', pymongo.DESCENDING).limit(-1)
        if (yield cursor.fetch_next):
            document = cursor.next_object()

            last_timestamp = document['ts']
            logging.info('Watching from timestamp: %s', last_timestamp.as_datetime())
        else:
            last_timestamp = None

        while True:
            if not cursor.alive:
                cursor = oplog.find({
                    'ts': {'$gt': last_timestamp},
                    'op': {'$in': WATCHABLE_OPERATIONS},
                    'ns': {'$in': WATCHABLE_COLLECTIONS}
                }, tailable=True, await_data=True)

                cursor.add_option(8)
                logging.debug('Tailable cursor recreated.')

            if (yield cursor.fetch_next):
                document = cursor.next_object()
                last_timestamp = document['ts']

                yield _dispatch_documents(document)

    except Exception as e:
        logging.exception(e)


@coroutine
def _dispatch_documents(document):
    namespace = document['ns']

    if namespace in _callbacks:
        try:
            results = yield dict(
                [(callback, callback(document['o'])) for callback in _callbacks[namespace]]
            )

            # Remove all failed callbacks
            for callback, result in results.iteritems():
                if result and result.exception():
                    logging.debug("Removing callback: %s", result.exception().message)
                    yield remove_callback(namespace, callback)

        except Exception as e:
            logging.exception(e)

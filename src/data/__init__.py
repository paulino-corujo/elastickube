import logging
import time

from tornado.gen import coroutine

PASSWORD_REGEX = "^(([a-zA-Z]+\d+)|(\d+[a-zA-Z]+))[a-zA-Z0-9]*$"
DEFAULT_GITREPO = "https://github.com/helm/charts.git"
SCHEMA_VERSION = 2


@coroutine
def init(database):
    logging.info("Initializing database...")

    yield setup_indexes(database)

    settings = yield database.Settings.find_one({"metadata.deletionTimestamp": None})

    if not settings:
        result = yield database.Settings.insert({
            "schema": "http://elasticbox.net/schemas/settings",
            "metadata": {
                "resourceVersion": time.time(),
                "creationTimestamp": time.time(),
                "deletionTimestamp": None
            },
            "charts": {
                "repo_url": DEFAULT_GITREPO
            },
            "authentication": {
                "password": {
                    "regex": PASSWORD_REGEX
                }
            },
            "schema_version": SCHEMA_VERSION
        })

        logging.debug("Initial Settings document created, %s", result)
    else:
        if settings["schema_version"] != SCHEMA_VERSION:
            migrate(database, settings)


@coroutine
def setup_indexes(database):
    yield database.Users.ensure_index(key_or_list="email", unique=True, sparse=True)
    yield database.Users.ensure_index(key_or_list="username", unique=True, sparse=True)
    yield database.Users.ensure_index(key_or_list="metadata.deletionTimestamp", unique=False, sparse=True)


def migrate(database, settings):
    logging.debug("Migrating DB from version %d to %d", settings['schema_version'], SCHEMA_VERSION)

    if settings['schema_version'] == 1:
        settings['charts'] = {
            "repo_url": DEFAULT_GITREPO
        }

        settings['schema_version'] = 2

    database.Settings.update({"_id": settings['_id']}, settings)

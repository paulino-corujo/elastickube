import logging
import os
import time

from tornado.gen import coroutine

from api.resources import resources

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
                    "regex": read_password_regex_from_file(os.path.join(resources.ROOT_PATH, 'password_default_regex'))
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


def read_password_regex_from_file(regex_password_file):
    with open(regex_password_file, 'r') as regex_file:
        password_regex = regex_file.read().replace('\n', '')

    return password_regex

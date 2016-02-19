import logging
import time

from tornado.gen import coroutine

PASSWORD_REGEX = "^(([a-zA-Z]+\d+)|(\d+[a-zA-Z]+))[a-zA-Z0-9]*$"
SCHEMA_VERSION = 1


@coroutine
def init(database):
    logging.info("Initializing database...")

    yield setup_indexes(database)

    settings = yield database.Settings.find_one({"deleted": None})
    if not settings:
        result = yield database.Settings.insert({
            "deleted": None,
            "schema": "http://elasticbox.net/schemas/settings",
            "metadata": {
                "resourceVersion": time.time(),
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
            migrate(settings["schema_version"])


@coroutine
def setup_indexes(database):
    yield database.Users.ensure_index(key_or_list="email", unique=True, sparse=True)
    yield database.Users.ensure_index(key_or_list="username", unique=True, sparse=True)
    yield database.Users.ensure_index(key_or_list="deleted", unique=False, sparse=True)


def migrate(previous_version):
    logging.debug("Migrating DB from version %d to %d", previous_version, SCHEMA_VERSION)

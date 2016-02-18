import logging
from datetime import datetime

from pymongo import MongoClient

PASSWORD_REGEX = "^(([a-zA-Z]+\d+)|(\d+[a-zA-Z]+))[a-zA-Z0-9]*$"
SCHEMA_VERSION = 1


def init(mongo_url):
    logging.info("Initializing database...")

    database = MongoClient(mongo_url).elastickube
    settings = database.Settings.find_one({"deleted": None})

    if not settings:
        result = database.Settings.insert({
            "created": datetime.utcnow().isoformat(),
            "deleted": None,
            "schema": "http://elasticbox.net/schemas/settings",
            "updated": datetime.utcnow().isoformat(),
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


def migrate(previous_version):
    logging.debug("Migrating DB from version %d to %d", previous_version, SCHEMA_VERSION)

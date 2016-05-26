#!/usr/bin/env python
import argparse
import os
import random
import string
import sys
import time
from datetime import datetime

from passlib.hash import sha512_crypt
from pymongo import MongoClient


def get_parser():
    parser = argparse.ArgumentParser(
        description='ElasticKube database management',
        epilog="See 'kubeman command --help' for more information")

    subparsers = parser.add_subparsers()

    auth_parser = subparsers.add_parser('auth', help='Auth providers management command')
    auth_parser.add_argument(
        '-c',
        required=False,
        default="mongodb://localhost:27017/",
        dest='connection_url',
        help='MongoDB connection url')

    auth_subparsers = auth_parser.add_subparsers()

    add_oauth_parser = auth_subparsers.add_parser('add-oauth', help='Add/Update Google Oauth settings')
    add_oauth_parser.set_defaults(func=add_oauth_settings)
    add_oauth_parser.add_argument(
        '-k',
        '--key',
        required=False,
        default=os.getenv('ELASTICKUBE_OAUTH_KEY'),
        dest='key',
        help='oauth key')
    add_oauth_parser.add_argument(
        '-s',
        '--secret',
        default=os.getenv('ELASTICKUBE_OAUTH_SECRET'),
        required=False,
        dest='secret',
        help='oauth secret')
    add_oauth_parser.add_argument(
        '-r',
        '--redirect-uri',
        default=os.getenv('ELASTICKUBE_REDIRECT_URI'),
        required=False,
        dest='redirect',
        help='oauth redirect uri')

    remove_oauth_parser = auth_subparsers.add_parser('remove-oauth', help='Remove Google Oauth settings')
    remove_oauth_parser.set_defaults(func=remove_oauth_settings)

    users_parser = subparsers.add_parser('users', help='Users management command')
    users_parser.add_argument(
        '-c',
        required=False,
        default="mongodb://localhost:27017/",
        dest='connection_url',
        help='MongoDB connection url')

    users_subparsers = users_parser.add_subparsers()

    add_user_parser = users_subparsers.add_parser('add-user', help='Add/Update User')
    add_user_parser.set_defaults(func=add_user)
    add_user_parser.add_argument(
        '-e',
        '--email',
        required=True,
        dest='email',
        help='User email')
    add_user_parser.add_argument(
        '-f',
        '--first',
        default='Firstname',
        required=False,
        dest='first',
        help='User firstname')
    add_user_parser.add_argument(
        '-l',
        '--lastname',
        default='Lastname',
        required=False,
        dest='last',
        help='User lastname')
    add_user_parser.add_argument(
        '-p',
        '--password',
        default='elastickube123',
        required=False,
        dest='password',
        help='User password')
    add_user_parser.add_argument(
        '-r',
        '--role',
        default='administrator',
        required=False,
        dest='role',
        help='User role')

    database_parser = subparsers.add_parser('database', help='Database management command')
    database_parser.add_argument(
        '-c',
        required=False,
        default="mongodb://localhost:27017/",
        dest='connection_url',
        help='MongoDB connection url')

    database_subparsers = database_parser.add_subparsers()

    delete_database_parser = database_subparsers.add_parser('delete-db', help='Delete database')
    delete_database_parser.set_defaults(func=delete_database)

    return parser


def add_oauth_settings(arguments):
    database = MongoClient(arguments.connection_url).elastickube
    settings = database.Settings.find_one({"deleted": None})
    settings["authentication"]["google_oauth"] = {
        "key": arguments.key,
        "secret": arguments.secret,
        "redirect_uri": arguments.redirect
    }

    database.Settings.update({'_id': settings['_id']}, settings)


def remove_oauth_settings(arguments):
    database = MongoClient(arguments.connection_url).elastickube
    settings = database.Settings.find_one({"deleted": None})
    settings["authentication"] = {"password": settings["authentication"]["password"]}

    database.Settings.update({'_id': settings['_id']}, settings)


def add_user(arguments):
    database = MongoClient(arguments.connection_url).elastickube
    user = database.Users.find_one({"metadata.deletionTimestamp": None, "email": arguments.email})
    if user is None:

        salt = "".join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(64))
        password = dict(
            hash=sha512_crypt.encrypt((arguments.password + salt).encode("utf-8"), rounds=40000),
            salt=salt)

        user = dict(
            email=arguments.email,
            username=arguments.email,
            password=password,
            firstname=arguments.first,
            lastname=arguments.last,
            role=arguments.role,
            schema="http://elasticbox.net/schemas/user",
            email_validated_at=datetime.utcnow().isoformat(),
            metadata=dict(
                resourceVersion=time.time(),
                creationTimestamp=time.time(),
                deletionTimestamp=None
            )
        )

        database.Users.insert(user)

    if arguments.role != "administrator":
        default_namespace = database.Namespaces.find_one({"name": "default"})
        if default_namespace:
            if "members" not in default_namespace:
                default_namespace["members"] = [arguments.email]
            else:
                if arguments.email not in default_namespace["members"]:
                    default_namespace["members"].append(arguments.email)

            database.Namespaces.update({"_id": default_namespace["_id"]}, default_namespace)


def delete_database(arguments):
    client = MongoClient(arguments.connection_url)
    client.drop_database('elastickube')

    for _ in xrange(0, 5):
        if 'elastickube' in client.database_names():
            time.sleep(1)
            client.drop_database('elastickube')
        else:
            return

    raise RuntimeError('Failed to delete elastickube database')


def main():
    parser = get_parser()
    args = parser.parse_args(sys.argv[1:])
    args.func(args)


if __name__ == '__main__':
    main()

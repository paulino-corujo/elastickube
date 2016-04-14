"""
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

from bson.objectid import ObjectId
import json
import logging
import random
import string
import urllib
from datetime import datetime, timedelta

import jwt
from passlib.hash import sha512_crypt
from tornado.auth import GoogleOAuth2Mixin
from tornado.gen import coroutine, Return
from tornado.web import RequestHandler, HTTPError

from api.v1 import ELASTICKUBE_TOKEN_HEADER, ELASTICKUBE_VALIDATION_TOKEN_HEADER
from api.v1.actions import emails
from data.query import Query


ROUNDS = 40000

def _generate_hashed_password(password):
    salt = "".join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(64))
    return {'hash': sha512_crypt.encrypt((password + salt).encode("utf-8"), rounds=ROUNDS), 'salt': salt}


def _fill_signup_invitation_request(document, firstname, lastname, password=None):
    document["firstname"] = firstname
    document["lastname"] = lastname
    document["email_validated_at"] = datetime.utcnow()
    if password is not None:
        document["password"] = _generate_hashed_password(password)


class AuthHandler(RequestHandler):

    @coroutine
    def authenticate_user(self, user):
        logging.info("Authenticating user '%(username)s'", user)

        token = dict(
            id=str(user["_id"]),
            username=user["username"],
            firstname=user["firstname"],
            lastname=user["lastname"],
            email=user["email"],
            role=user["role"],
            created=datetime.utcnow().isoformat(),
            exp=datetime.utcnow() + timedelta(30)
        )

        user["last_login"] = datetime.utcnow()
        yield self.settings["database"].Users.update({"_id": user["_id"]}, user)

        token = jwt.encode(token, self.settings["secret"], algorithm="HS256")
        self.set_cookie(ELASTICKUBE_TOKEN_HEADER, token)

        logging.info("User '%(username)s' authenticated.", user)
        raise Return(token)


class AuthProvidersHandler(RequestHandler):

    @coroutine
    def get(self):
        providers = dict()

        # If there are no users created then we need to return an empty list of providers to enable the signup flow
        if (yield Query(self.settings["database"], "Users").find_one()) is None:
            self.write({})
        else:
            settings = yield Query(self.settings["database"], "Settings").find_one()

            if "google_oauth" in settings["authentication"]:
                providers['google'] = dict(auth_url="/api/v1/auth/google")

            if "password" in settings["authentication"]:
                providers['password'] = dict(regex=settings["authentication"]["password"]["regex"])

            validation_token = self.request.headers.get(ELASTICKUBE_VALIDATION_TOKEN_HEADER)
            if validation_token is not None:
                user = yield Query(self.settings["database"], "Users").find_one({"invite_token": validation_token})
                if user is not None and 'email_validated_at' not in user:
                    providers['email'] = user[u'email']

            self.write(providers)


class SignupHandler(AuthHandler):

    @staticmethod
    def _validate_signup_data(data):
        if "email" not in data:
            raise HTTPError(400, message="Email is required.")

        if "password" not in data:
            raise HTTPError(400, message="Password is required.")

        if "firstname" not in data:
            raise HTTPError(400, message="First name is required.")

        if "lastname" not in data:
            raise HTTPError(400, message="Last name is required.")

        return True

    @coroutine
    def _update_invited_user(self, validation_token, data):
        user = yield Query(self.settings["database"], "Users").find_one(
            {"invite_token": validation_token, "email": data["email"]})

        if user is not None and "email_validated_at" not in user:
            for namespace_name in user["namespaces"]:
                namespace = yield Query(self.settings["database"], "Namespaces").find_one({"name": namespace_name})
                if namespace is None:
                    logging.warn("Cannot find namespace %s", namespace_name)
                else:
                    if "members" in namespace:
                        namespace["members"].append(user["username"])
                    else:
                        namespace["members"] = [user["username"]]

                    yield Query(self.settings["database"], "Namespaces").update(namespace)

            del user["namespaces"]

            _fill_signup_invitation_request(
                user, firstname=data["firstname"], lastname=data["lastname"],
                password=data["password"])

            raise Return(user)
        else:
            raise HTTPError(403, message="Invitation not found.")

    @coroutine
    def post(self):
        try:
            data = json.loads(self.request.body)
        except Exception:
            raise HTTPError(400, message='Invalid JSON')

        validation_token = self.request.headers.get(ELASTICKUBE_VALIDATION_TOKEN_HEADER)
        if validation_token is not None:
            self._validate_signup_data(data)
            user = yield self._update_invited_user(validation_token, data)
            token = yield self.authenticate_user(user)
            self.write(token)
            self.flush()

        # Signup can be used only the first time
        elif (yield Query(self.settings["database"], "Users").find_one()) is not None:
            raise HTTPError(403, message="Onboarding already completed.")

        else:
            self._validate_signup_data(data)

            user = dict(
                email=data["email"],
                username=data["email"],
                password=_generate_hashed_password(data["password"]),
                firstname=urllib.quote(data["firstname"]),
                lastname=urllib.quote(data["lastname"]),
                role="administrator",
                schema="http://elasticbox.net/schemas/user",
                email_validated_at=datetime.utcnow().isoformat()
            )

            signup_user = yield Query(self.settings["database"], "Users").insert(user)
            token = yield self.authenticate_user(signup_user)
            self.write(token)
            self.flush()


class ResetPasswordHandler(AuthHandler):

    @coroutine
    def post(self):
        logging.info("Initiating ResetPasswordHandler post")

        data = json.loads(self.request.body)
        if "email" not in data:
            raise HTTPError(400, reason="Missing email in body request.")

        email = data["email"]

        user = yield self.settings["database"].Users.find_one({"email": email})

        if not user:
            logging.debug("User with email '%s' not found.", email)
            raise HTTPError(200)

        settings = yield self.settings["database"].Settings.find_one()
        if "mail" in settings:
            mail_settings = settings["mail"]

            token = dict(
                id=str(user["_id"]),
                hash=user['password']['hash'][:-16],
                exp=datetime.utcnow() + timedelta(minutes=10)
            )

            token = jwt.encode(token, self.settings["secret"], algorithm="HS256")

            user_data = {
                'name': user.get('firstname'),
                'email': user['email'],
                'token': token
            }

            try:
                yield emails.send_reset_password_link(mail_settings, user_data, settings)
            except Exception:
                raise HTTPError(500, reason='Error sending reset password email.')
            raise HTTPError(200)
        else:
            logging.warning("Mail settings not added")
            raise HTTPError(412, reason="Mail settings not added.")


class ChangePasswordHandler(AuthHandler):

    @coroutine
    def post(self):
        logging.info("Initiating ChangePasswordHandler post")

        data = json.loads(self.request.body)
        if "password" not in data:
            raise HTTPError(400, reason="Missing arguments in change password request.")

        if "token" not in data:
            raise HTTPError(400, reason="Missing arguments in change password request.")

        password = data["password"]

        try:
            token = jwt.decode(data["token"], self.settings['secret'], algorithm='HS256')
        except Exception:
            raise HTTPError(400, reason="Invalid token or token has expired")

        user = yield self.settings["database"].Users.find_one({"_id": ObjectId(token["id"])})

        if not user:
            logging.error("Error trying to change user password for token: '%s'.", token)
            raise HTTPError(200)

        if not user["password"]["hash"][:-16] == token["hash"]:
            raise HTTPError(400, reason="Invalid token or token has expired")

        user["password"] = _generate_hashed_password(password)

        yield Query(self.settings["database"], "Users").update_fields({"_id": user["_id"]}, {
            "password": user["password"]
        })
        raise HTTPError(200)


class PasswordHandler(AuthHandler):

    @coroutine
    def post(self):
        logging.info("Initiating PasswordHandler post")

        data = json.loads(self.request.body)
        if "username" not in data:
            raise HTTPError(400, reason="Missing username in body request.")

        if "password" not in data:
            raise HTTPError(400, reason="Missing password in body request.")

        username = data["username"]
        password = data["password"]

        user = yield self.settings["database"].Users.find_one({"username": username})
        if not user:
            logging.debug("Username '%s' not found.", username)
            raise HTTPError(401, reason="Invalid username or password.")

        encoded_user_password = user["password"]["hash"].encode("utf-8")
        if sha512_crypt.verify((password + user["password"]["salt"]).encode("utf-8"), encoded_user_password):
            token = yield self.authenticate_user(user)
            self.write(token)
            self.flush()
        else:
            logging.info("Invalid password for user '%s'.", username)
            raise HTTPError(401, reason="Invalid username or password.")


class GoogleOAuth2LoginHandler(AuthHandler, GoogleOAuth2Mixin):

    @coroutine
    def get(self):
        logging.info("Initiating Google OAuth.")

        settings = yield Query(self.settings["database"], "Settings").find_one()
        google_oauth = settings[u'authentication'].get('google_oauth', None)
        if google_oauth is None:
            raise HTTPError(403, 'Forbidden request')

        # Add OAuth settings for GoogleOAuth2Mixin
        self.settings['google_oauth'] = {
            'key': google_oauth['key'],
            'secret': google_oauth['secret']
        }

        code = self.get_argument('code', False)
        if code:
            logging.debug("Google redirect received.")

            auth_data = yield self.get_authenticated_user(
                redirect_uri=google_oauth["redirect_uri"],
                code=code)

            auth_user = yield self.oauth2_request(
                "https://www.googleapis.com/oauth2/v1/userinfo",
                access_token=auth_data['access_token'])

            if auth_user["verified_email"]:
                user = yield self.settings["database"].Users.find_one({"email": auth_user["email"]})

                # Validate user if it signup by OAuth2
                if user and 'email_validated_at' not in user:
                    logging.debug('User validated via OAuth2 %s', auth_user["email"])
                    _fill_signup_invitation_request(
                        user, firstname=auth_data.get('given_name', auth_data.get('name', "")),
                        lastname=auth_data.get('family_name', ""), password=None)

                    user = yield Query(self.settings["database"], 'Users').update(user)

                if user:
                    yield self.authenticate_user(user)
                    self.redirect('/')
                else:
                    logging.debug("User '%s' not found", auth_user["email"])
                    raise HTTPError(400, "Invalid authentication request.")
            else:
                logging.info("User email '%s' not verified.", auth_user["email"])
                raise HTTPError(400, "Email is not verified.")
        else:
            logging.debug("Redirecting to google for authentication.")
            yield self.authorize_redirect(
                redirect_uri=google_oauth['redirect_uri'],
                client_id=google_oauth['key'],
                scope=['profile', 'email'],
                response_type='code',
                extra_params={'approval_prompt': 'auto'})

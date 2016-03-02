import json
import logging
import random
import string
from datetime import datetime, timedelta

import jwt
from passlib.hash import sha512_crypt
from tornado.auth import GoogleOAuth2Mixin
from tornado.gen import coroutine, Return
from tornado.web import RequestHandler, HTTPError

from api.v1 import ELASTICKUBE_TOKEN_HEADER, ELASTICKUBE_VALIDATION_TOKEN_HEADER
from data.query import Query


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
            expires=(datetime.utcnow() + timedelta(30)).isoformat()
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


def _validate_data_signup_or_bad_request(data):
    if "email" not in data:
        raise HTTPError(400, message="Email is required.")

    if "password" not in data:
        raise HTTPError(400, message="Password is required.")

    if "firstname" not in data:
        raise HTTPError(400, message="First name is required.")

    if "lastname" not in data:
        raise HTTPError(400, message="Last name is required.")

    return True


class SignupHandler(AuthHandler):

    @coroutine
    def _update_invited_user(self, validation_token, data):
        user = yield Query(self.settings["database"], "Users").find_one(
            {"invite_token": validation_token, "email": data["email"]})
        if user is not None and 'email_validated_at' not in user:
            user[u"username"] = data.get("username", data["email"])
            user[u"password"] = _generate_hashed_password(data["password"])
            user[u"firstname"] = data["firstname"]
            user[u"lastname"] = data["lastname"]
            user[u"role"] = "user"
            user[u"schema"] = "http://elasticbox.net/schemas/user"
            user[u"email_validated_at"] = datetime.utcnow().isoformat()
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
            _validate_data_signup_or_bad_request(data)
            user = yield self._update_invited_user(validation_token, data)
            token = yield self.authenticate_user(user)
            self.write(token)
            self.flush()

        # Signup can be used only the first time
        elif (yield Query(self.settings["database"], "Users").find_one()) is not None:
            raise HTTPError(403, message="Onboarding already completed.")

        else:
            _validate_data_signup_or_bad_request(data)

            user = dict(
                email=data["email"],
                username=data["email"],
                password=_generate_hashed_password(data["password"]),
                firstname=data["firstname"],
                lastname=data["lastname"],
                role="administrator",
                schema="http://elasticbox.net/schemas/user",
                email_validated_at=datetime.utcnow().isoformat()
            )

            signup_user = yield Query(self.settings["database"], "Users").insert(user)
            token = yield self.authenticate_user(signup_user)
            self.write(token)
            self.flush()


def _generate_hashed_password(password):
    salt = "".join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(64))
    return {'hash': sha512_crypt.encrypt((password + salt).encode("utf-8"), rounds=40000), 'salt': salt}


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

        code = self.get_argument('code', False)

        # Add OAuth settings for GoogleOAuth2Mixin
        self.settings['google_oauth'] = {
            'key': google_oauth['key'],
            'secret': google_oauth['secret']
        }

        if code:
            logging.debug("Google redirect received.")
            auth_data = yield self.get_authenticated_user(
                redirect_uri=google_oauth["redirect_uri"],
                code=code)

            logging.debug("User Authenticating, getting user info.")
            auth_user = yield self.oauth2_request(
                "https://www.googleapis.com/oauth2/v1/userinfo",
                access_token=auth_data['access_token'])

            if auth_user["verified_email"]:
                logging.debug("Google user email verified.")
                user = yield self.settings["database"].Users.find_one({"email": auth_user["email"]})

                if user:  # TODO: Accept user invitation if user already exists
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

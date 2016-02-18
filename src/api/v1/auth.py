import json
import logging
from datetime import datetime, timedelta

import jwt
from tornado.auth import GoogleOAuth2Mixin, OAuth2Mixin
from tornado.gen import coroutine, Return
from tornado.web import RequestHandler, HTTPError

from api.db.query import Query
from api.v1 import ELASTICKUBE_TOKEN_HEADER


class AuthHandler(RequestHandler):

    @coroutine
    def authenticate_user(self, user):
        logging.info("Authenticating user '%(username)s'" % user)

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

        token = jwt.encode(token, self.settings['secret'], algorithm='HS256')
        self.set_cookie(ELASTICKUBE_TOKEN_HEADER, token)
        self.redirect('/')

        logging.info("User '%s' authenticated." % user["username"])
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
                providers['google'] = dict(
                    auth_url="/api/v1/auth/google"
                )

            if "password" in settings["authentication"]:
                providers['password'] = dict(
                    regex=settings["authentication"]["password"]["regex"]
                )

            self.write(providers)


class SignupHandler(AuthHandler):

    @coroutine
    def post(self):
        # Signup can be used only the first time
        if (yield Query(self.settings["database"], "Users").find_one()) is not None:
            raise HTTPError(403, message="Onboarding already completed.")

        else:
            data = json.loads(self.request.body)
            if "email" not in data:
                raise HTTPError(400, message="Email is required.")

            if "password" not in data:
                raise HTTPError(400, message="Password is required.")

            if "firstname" not in data:
                raise HTTPError(400, message="First name is required.")

            if "lastname" not in data:
                raise HTTPError(400, message="Last name is required.")

            user = dict(
                email=data["email"],
                username=data["email"],
                password=data["password"],
                firstname=data["firstname"],
                lastname=data["lastname"],
                role="administrator",
                schema="http://elasticbox.net/schemas/user",
                email_validated_at=datetime.utcnow().isoformat()
            )

            signup_user = yield Query(self.settings["database"], "Users").insert(user)
            yield self.authenticate_user(signup_user)


class PasswordHandler(AuthHandler):

    @coroutine
    def post(self):
        logging.info("Initiating PasswordHandler post")

        data = json.loads(self.request.body)
        if 'username' not in data:
            raise HTTPError(400, reason="Missing username in body request.")

        if 'password' not in data:
            raise HTTPError(400, reason="Missing password in body request.")

        username = data['username']
        password = data['password']

        user = yield self.settings["database"].Users.find_one({"username": username})
        if not user:
            logging.debug("Username '%s' not found." % username)
            raise HTTPError(401, reason="Invalid username or password.")

        if user["password"] == password:
            token = yield self.authenticate_user(user)
            self.write(token)
            self.flush()
        else:
            logging.info("Invalid password for user '%'." % username)
            raise HTTPError(401, reason="Invalid username or password.")


class GoogleOAuth2LoginHandler(AuthHandler, GoogleOAuth2Mixin):

    @coroutine
    def get(self):
        logging.info("Initiating Google OAuth.")

        google_oauth = self.settings.get('google_oauth', False)
        code = self.get_argument('code', False)

        if code:
            logging.debug("Google redirect received.")
            auth_data = yield self.get_authenticated_user(
                redirect_uri=google_oauth['redirect_uri'],
                code=code)

            logging.debug("User Authenticating, getting user info.")
            auth_user = yield self.oauth2_request(
                "https://www.googleapis.com/oauth2/v1/userinfo",
                access_token=auth_data['access_token'])

            if auth_user["verified_email"]:
                logging.debug("Google user email verified.")
                user = yield self.settings["database"].Users.find_one({"email": auth_user["email"]})

                if user:
                    yield self.authenticate_user(user)
                else:
                    logging.debug("User '%s' not found" % auth_user["email"])
                    raise HTTPError(400, "Invalid authentication request.")
            else:
                logging.info("User email '%s' not verified." % auth_user["email"])
                raise HTTPError(400, "Email is not verified.")
        else:
            logging.debug("Redirecting to google for authentication.")
            yield self.authorize_redirect(
                redirect_uri=google_oauth['redirect_uri'],
                client_id=google_oauth['key'],
                scope=['profile', 'email'],
                response_type='code',
                extra_params={'approval_prompt': 'auto'})

import logging
import uuid

from tornado.gen import coroutine, Return

from data.query import Query
from api.kube import emails


class InvitationsActions(object):

    def __init__(self, settings):
        logging.info("Initializing InviteActions")
        self.database = settings['database']

    def check_permissions(self, user, _operation):
        if user['role'] == 'administrator':
            return True
        else:
            return False

    @coroutine
    def _invite_user(self, address, hostname):
        invite_token = str(uuid.uuid4())
        invite_user = create_invite_user_document(address, invite_token)
        yield Query(self.database, "Users").insert(invite_user)
        invite_info = {
            'email': address,
            'confirm_url': _get_invite_address(
                hostname, invite_token)
        }
        raise Return((invite_user, invite_info))

    @coroutine
    def create(self, document):
        addresses = document.get('emails', [])
        note = document.get('note', '')
        logging.info('Inviting users "%s" with note "%s"', addresses, note)
        settings = yield self.database.Settings.find_one({"deleted": None})
        hostname = settings['hostname']

        new_users = []
        invites = []
        for address in addresses:
            user, invite_info = yield self._invite_user(address, hostname)
            new_users.append(user)
            invites.append(invite_info)

        mail_settings = settings["mail"]
        if "mail" in settings:
            yield emails.send_invites(mail_settings, invites, note)
        else:
            logging.warning("Mail settings not added")

        raise Return([])


def _get_invite_address(hostname, token):
    return '{}/invite/{}'.format(hostname, token)


def create_invite_user_document(mail, invite_token):
    return {
        "email": mail,
        "firstname": '',
        "lastname": '',
        "role": 'user',
        "schema": "http://elasticbox.net/schemas/user",
        "username": mail,  # TODO: What should be the username?
        "invite_token": invite_token,
    }

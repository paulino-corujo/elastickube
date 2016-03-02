import logging

import cgi
from email.MIMEText import MIMEText
from smtplib import SMTP, SMTP_SSL

import concurrent.futures
from tornado.gen import Return, coroutine

from api.resources.resources import INVITE_TEMPLATE, INVITE_SUBJECT

DEFAULT_THREADPOOL = concurrent.futures.ThreadPoolExecutor(max_workers=6)
INVITE_BODY_TYPE = 'html'


def start_connection(secure, server, port):
    connection = None
    if secure:
        try:
            connection = SMTP_SSL(server, port)
        except Exception:
            connection = None  # SSL/TLS is not available, fallback to starttls
            logging.info('Fall back to STARTTLS connection')

        if connection is None:
            connection = SMTP(server, port)
            connection.set_debuglevel(True)
            connection.starttls()

    else:
        connection = SMTP(server, port)

    return connection


def send(smtp_config, address, subject, body, body_type):
    server = smtp_config['server']
    port = int(smtp_config['port'])
    logging.debug('Sending mail "%s" from "%s" to server "%s"', subject, address, server)

    connection = start_connection(smtp_config.get('ssl', True), server, port)
    connection.set_debuglevel(False)

    authentication = smtp_config.get('authentication')
    if authentication is not None:
        connection.login(authentication['username'], authentication['password'])

    sender = smtp_config['no_reply_address']

    message = MIMEText(body, body_type)
    message['Subject'] = subject
    message['From'] = sender
    try:
        connection.sendmail(sender, address, message.as_string())
    finally:
        connection.close()

    logging.debug("Mail sent")


def generate_invite_template(invite_address, message):
    escaped_message = cgi.escape(message)  # Message must be unicode
    return INVITE_TEMPLATE.format(invite_address=invite_address, custom_message=escaped_message)


def send_invites_sync(smtp_config, info_invites, message):
    try:
        for invite in info_invites:
            template = generate_invite_template(invite['confirm_url'], message)
            send(smtp_config, invite['email'], INVITE_SUBJECT, template, INVITE_BODY_TYPE)
    except Exception:
        logging.exception("Exception detected sending invites")
        raise


@coroutine
def send_invites(smtp_config, info_invites, message, threadpool=None):
    if threadpool is None:
        threadpool = DEFAULT_THREADPOOL

    result = yield threadpool.submit(send_invites_sync, smtp_config, info_invites, message)
    raise Return(result)

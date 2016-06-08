import os

TEMPLATE_PATH = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(TEMPLATE_PATH, 'notifications.html')) as invite_file:
    NOTIFICATIONS_TEMPLATE = invite_file.read()

with open(os.path.join(TEMPLATE_PATH, 'namespace_details.html')) as invite_file:
    NAMESPACE_TEMPLATE = invite_file.read()

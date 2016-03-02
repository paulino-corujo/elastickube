import os

ROOT_PATH = os.path.dirname(os.path.abspath(__file__))

IF_MODIFIED_HEADER = 'If-Modified-Since'
ACCEPT_HEADER = 'Accept'
CONTENT_TYPE_HEADER = 'Content-type'
CACHE_CONTROL = 'Cache-Control'
CACHE_CONTROL_NO_CACHE = 'no-cache, must-revalidate'

SVG_CONTENT_TYPE = 'image/svg+xm'
PNG_CONTENT_TYPE = 'image/png'

with open(os.path.join(ROOT_PATH, 'invite.html')) as invite_file:
    INVITE_TEMPLATE = invite_file.read()

INVITE_SUBJECT = u"You've been invited to ElasticKube"

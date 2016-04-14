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

with open(os.path.join(ROOT_PATH, 'reset_password_email.html')) as reset_password_email_file:
    RESET_PASSWORD_EMAIL_TEMPLATE = reset_password_email_file.read()

INVITE_SUBJECT = u"You've been invited to ElasticKube"
RESET_PASSWORD_EMAIL_SUBJECT = u"Reset your password"

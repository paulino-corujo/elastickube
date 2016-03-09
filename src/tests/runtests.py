#!/usr/bin/env python
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

import argparse
import logging
import sys

import nose
from nose.plugins.multiprocess import MultiProcess

logging.basicConfig(stream=sys.stdout, level=logging.ERROR)


def parse_arguments():
    parser = argparse.ArgumentParser(description="Run the ElasticKube test suite.")
    parser.add_argument(
        "--processes",
        dest="processes",
        nargs="?",
        default=1,
        type=int,
        help="Run tests using up to N parallel processes"
    )

    parser.add_argument(
        "--process-timeout",
        dest="timeout",
        nargs="?",
        default=10,
        type=int,
        help="Run tests with a timeout of N seconds per process"
    )

    parser.add_argument("files", nargs="*")

    options, extras = parser.parse_known_args()
    if '-v' in extras:
        logging.getLogger().setLevel(logging.DEBUG)

    return options

if __name__ == "__main__":
    nose.main(parse_arguments(), plugins=[MultiProcess()])

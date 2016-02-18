#!/usr/bin/env python
import logging
import sys
from argparse import ArgumentParser

import nose
from nose.plugins.multiprocess import MultiProcess

logging.basicConfig(stream=sys.stdout, level=logging.ERROR)


if __name__ == "__main__":
    parser = ArgumentParser(description="Run the ElasticKube test suite.")
    parser.add_argument(
        '--processes',
        dest='processes',
        nargs='?',
        default=1,
        type=int,
        help='Run tests using up to N parallel processes.'
    )

    parser.add_argument(
        '--process-timeout',
        dest='timeout',
        nargs='?',
        default=10,
        type=int,
        help='Run tests with a timeout of N seconds per process'
    )

    parser.add_argument('files', nargs='*')

    options, extras = parser.parse_known_args()
    if '-v' in extras:
        logging.getLogger().setLevel(logging.DEBUG)

    nose.main(options, plugins=[MultiProcess()])

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
import os
import subprocess
import sys


def get_parser():
    parser = argparse.ArgumentParser(description='Run the ElasticKube tests suite.')
    parser.add_argument(
        '-a',
        '--auto-correct',
        dest='auto_correct',
        action='store_true',
        help='Try to fix pep8 issue before running pep8 checker')

    return parser


def run_autopep8(python_files):
    autopep8_comment = ['autopep8', '--pep8-passes=50', '-r', '--max-line-length=120', '-i'] + python_files
    subprocess.call(autopep8_comment)


def run_pep8(python_files):
    pep8_command = ['pep8', '--max-line-length=120'] + python_files
    return subprocess.call(pep8_command)


def main():
    parser = get_parser()
    args = parser.parse_args()

    git_root = subprocess.check_output(['git', 'rev-parse', '--show-toplevel']).strip()

    os.chdir(git_root)
    python_files = subprocess.check_output(['git', 'ls-files', '*py'])
    python_files = python_files.strip().split()

    if args.auto_correct:
        autopep8_comment = ['autopep8', '--pep8-passes=50', '-r', '--max-line-length=120', '-i'] + python_files
        subprocess.call(autopep8_comment)

    pep8_command = ['pep8', '--max-line-length=120'] + python_files
    sys.exit(subprocess.call(pep8_command))


if __name__ == '__main__':
    main()

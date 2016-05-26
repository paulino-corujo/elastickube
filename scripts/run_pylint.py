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

from __future__ import print_function

import os
import subprocess
import sys


SCRIPTS_DIR = os.path.abspath(os.path.dirname(__file__))
PRODUCTION_RC = os.path.join(SCRIPTS_DIR, 'pylintrc_default')


def get_files_for_linting():
    git_root = subprocess.check_output(['git', 'rev-parse', '--show-toplevel']).strip()
    os.chdir(git_root)

    python_files = subprocess.check_output(['git', 'ls-files', '*py'])
    python_files = python_files.strip().split()

    return python_files


def lint_fileset(filenames, rcfile, description):
    filenames = [filename for filename in filenames if os.path.exists(filename)]

    if filenames:
        rc_flag = '--rcfile=%s' % rcfile
        pylint_shell_command = ['pylint', rc_flag] + filenames
        status_code = subprocess.call(pylint_shell_command)
        if status_code != 0:
            print('Pylint failed on %s with status %d.' % (description, status_code), file=sys.stderr)
            sys.exit(status_code)
    else:
        print('Skipping %s, no files to lint.' % description)


def main():
    library_files = get_files_for_linting()
    lint_fileset(library_files, PRODUCTION_RC, 'library code')


if __name__ == '__main__':
    main()

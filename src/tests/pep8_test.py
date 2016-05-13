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
import subprocess

import unittest2


class TestPep8(unittest2.TestCase):

    def test_pep8(self):
        git_root = subprocess.check_output(['git', 'rev-parse', '--show-toplevel']).strip()

        os.chdir(git_root)
        python_files = subprocess.check_output(['git', 'ls-files', '*py'])
        python_files = python_files.strip().split()

        pep8_command = ['pep8', '--max-line-length=120'] + python_files
        result = subprocess.call(pep8_command)

        self.assertEqual(result, 0, "Code not Pep8 compliant")


if __name__ == "__main__":
    unittest2.main()

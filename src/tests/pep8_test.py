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

import logging
import os
import subprocess

from tornado import testing


class Pep8Test(testing.AsyncTestCase):

    _multiprocess_can_split_ = True

    def pep8_test(self):
        logging.debug("Start pep8_test")

        src_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        command = " ".join(["pep8", "--max-line-length=120 --exclude=node_modules", src_folder]).split()
        pep8_process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        errors, _ = pep8_process.communicate()

        self.assertFalse(errors is not None and errors.strip() != '', "Pep8 errors %s" % errors)

        logging.debug("Completed pep8_test")


if __name__ == "__main__":
    testing.main()

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

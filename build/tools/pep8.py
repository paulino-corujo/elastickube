"""
ElasticBox Confidential
Copyright (c) 2012 All Right Reserved, ElasticBox Inc.

NOTICE:  All information contained herein is, and remains the property
of ElasticBox. The intellectual and technical concepts contained herein are
proprietary and may be covered by U.S. and Foreign Patents, patents in process,
and are protected by trade secret or copyright law. Dissemination of this
information or reproduction of this material is strictly forbidden unless prior
written permission is obtained from ElasticBox
"""

import sys
import subprocess
import argparse

NUM_AUTO_PEP8_PASSES = 200


def _run_pep8(arguments_to_pass, file_name):
    command = ' '.join(['pep8', arguments_to_pass, file_name]).split()
    p = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, _ = p.communicate()

    return output


def _run_auto_pep8(arguments_to_pass, file_name):
    command = ' '.join(['autopep8',
                        '-v',
                        '--pep8-passes={}'.format(NUM_AUTO_PEP8_PASSES),
                        '-r',
                        arguments_to_pass,
                        '-i',
                        file_name]).split()

    p = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    _, errors = p.communicate()
    return errors


def check_and_fix(file_paths, exclude_files=None, verbose=False):
    arguments_to_pass = '--max-line-length=120'

    unfixed_violations = []
    for file_path in file_paths:
        _run_auto_pep8(arguments_to_pass, file_path)
        remaining_violations = _run_pep8(arguments_to_pass, file_path)
        if remaining_violations.strip() == '':
            remaining_violations = None

        if remaining_violations is not None:
            unfixed_violations.append('{}\n{}'.format(file_path, remaining_violations))

    if len(unfixed_violations) > 0:
        print 'The following PEP8 violations were not fixed automatically:'
        print '\n'.join(unfixed_violations)
    else:
        if verbose:
            print 'No PEP8 violations remaining'

    return unfixed_violations


def check(file_paths, verbose=False):
    non_compliance = ''
    for file_path in file_paths:
        non_compliance = _run_pep8('--max-line-length=120', file_path)
        if verbose:
            print 'Checking PEP8 style on {}...'.format(file_path)

        if non_compliance is not None and non_compliance.strip() != '':
            print '=' * 80
            print 'The following PEP8 violations were found:'
            print '-' * 80
            print non_compliance
            print '=' * 80
            print ''
        else:
            if verbose:
                print 'No PEP8 violations found. Congratulations!'
                print 'Moving to the next file...'

    if verbose:
        print 'No more files; done!'

    return non_compliance


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-f', '--files', nargs='+', type=str, default=None)
    parser.add_argument('-a', '--auto_correct', action='store_const', const=True, default=False)
    parser.add_argument('-v', '--verbose', action='store_const', const=True, default=False)
    args = parser.parse_args()

    if args.auto_correct:
        sys.exit(check_and_fix(args.files, args.verbose))
    else:
        sys.exit(check(args.files,  args.verbose))

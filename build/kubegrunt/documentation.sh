#!/bin/bash -e

USAGE="Usage : build.sh [options]

Example:
    package.sh -r /repo/master

Options:
    -o Output Folder
    -d Documentation Folder
    -h Display this message
"

function help() {
    echo "${USAGE}"

    if [[ ${1} ]]
    then
        echo ${1}
    fi
}

# Handle options
while getopts ":o:d:h" ARGUMENT
do
    case ${ARGUMENT} in

        o )  OUTPUT_FOLDER=$OPTARG;;
        d )  DOCUMENTATION_FOLDER=$OPTARG;;
        h )  help; exit 0;;
        : )  echo "Missing option argument for -$OPTARG"; exit 1;;
        \?)  help "Option does not exist : $OPTARG"; exit 1;;

    esac
done

if [ -z ${OUTPUT_FOLDER} ]
then
    help "Output Folder (-o) must be specified."
    exit 1
fi

if [ -z ${DOCUMENTATION_FOLDER} ]
then
    help "Documentation Folder (-d) must be specified."
    exit 1
fi

# Create environment, download the pip packages and build the wheel folder
VIRTUALENV_FOLDER=$(mktemp -d)
virtualenv -q --clear "${VIRTUALENV_FOLDER}"
source "${VIRTUALENV_FOLDER}/bin/activate"

pip install sphinx sphinx-autobuild sphinx_rtd_theme

PYTHONPATH=${REPOSITORY_FOLDER}
sphinx-build -b dirhtml ${DOCUMENTATION_FOLDER} ${OUTPUT_FOLDER}

# Exit virtualenv
deactivate

# Delete folder
rm -rf ${VIRTUALENV_FOLDER}

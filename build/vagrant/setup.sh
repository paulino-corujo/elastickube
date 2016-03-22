#!/bin/bash -e

# Install ElasticBox bootstrap
apt-get -y update
apt-get -y install python-pip curl

pip install --no-compile elasticbox-docker

# Create code folder
chown -R elasticbox:elasticbox /opt/elastickube

sudo bash -- << \
_____________EXECUTE_BOXES_____________

export DEBIAN_FRONTEND=noninteractive
export ELASTICBOX_PATH=/opt/elastickube/build
export ELASTICBOX_INSTANCE_PATH=${ELASTICBOX_PATH}

elasticbox run --install --exit
_____________EXECUTE_BOXES_____________

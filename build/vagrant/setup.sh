#!/bin/bash -e

mkdir -p /opt/elastickube
chown -R elasticbox:elasticbox /opt/elastickube

mkdir -p /home/elasticbox/.ssh
pushd /home/elasticbox
    chown -R elasticbox:elasticbox .ssh
    chmod -R 700 .ssh
    chmod 600 .ssh/*
popd

# Start Rsync daemon and enable it at boot
sudo sed -i 's/^RSYNC_ENABLE=false/RSYNC_ENABLE=true/' /etc/default/rsync
sudo /etc/init.d/rsync start

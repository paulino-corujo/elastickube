#!/bin/bash

# Build the box image if not present
if [[ ! -f "ubuntu-14-04-x64-virtualbox.box" ]]; then
    packer build -except="vmware-iso" template.json
fi

# Remove current box in Vagrant
if [[ -n "$(vagrant box list | grep '^elasticbox/ubuntu-14.04')" ]]; then
    vagrant box remove --force elasticbox/ubuntu-14.04
fi

# Install the box
vagrant box add --force --name elasticbox/ubuntu-14.04 ubuntu-14-04-x64-virtualbox.box

#!/bin/bash

apt-get update
apt-get -y upgrade
apt-get -y install curl build-essential dkms linux-headers-generic linux-headers-$(uname -r)

# Enable password-less sudo
sed -i -e 's/%sudo\tALL=(ALL:ALL) ALL/%sudo\tALL=NOPASSWD:ALL/g' /etc/sudoers

# Fixes "stdin: is not a tty"
sed -i -e 's/mesg n/tty -s \&\& mesg n/g' /root/.profile

# Set LC_ALL locale
if [[ "$(grep -c "^LC_ALL=" /etc/environment)" -eq "0" ]]; then
    echo 'LC_ALL="en_US.UTF-8"' >> /etc/environment
fi

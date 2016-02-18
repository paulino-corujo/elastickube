#!/bin/bash

mkdir /media/VBoxGuestAdditions
mount -o loop,ro VBoxGuestAdditions.iso /media/VBoxGuestAdditions

sh /media/VBoxGuestAdditions/VBoxLinuxAdditions.run
umount /media/VBoxGuestAdditions

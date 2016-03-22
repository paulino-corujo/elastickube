# Overview

This box installs a fully functional Kubernetes system including the following basic services:

- SKYDNS
- KubeUI (comming soon)

Additionally an upstart service watches for filesystem changes and rebuilds a docker image with the source code of the elastickube respository. The same service maintains an updates a replication controller and linked service within the `kube-system` namespace.

**After the box is deployed a grunt job builds the containers and starts elastickube, this operation might take a 3 or 4 minutes**

# Using kubectl

As part of the install process, an alias pointing to the latest kubectl is created and configured. Usage:

    kubectl cluster-info
    kubectl get pod

A second alias name `ks` provides a shortcut to `kubectl --namespace=kube-system`. Usage:

    ks get pods

## Accessing the ElasticKube

ElasticKube can be accessed through the host port at the following url:

http://10.5.10.6/

## Tail the logs of elasticbox api/access container

Use the alias: 'kubelogs' to tail the logs

    kubelogs
    
Use the alias: 'sshapi' to ssh into the running api container

    sshapi

## MongoDB

Mongo is hosted in a resource controller called `elastickube-mongo` on the `kube-system` namespaces. The pod exposes the mongo port using the host port.

Mongo tools are also installed in the host as part of the setup process. Usage:

    mongo admin
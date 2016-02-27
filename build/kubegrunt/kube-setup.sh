#!/bin/bash

REPO_ROOT=$(git rev-parse --show-toplevel)
KUBECTL="/opt/kubernetes/$(ls /opt/kubernetes | head -n 1)/bin/kubectl"

# Ensure mongo controller is running
if [[ -z $(${KUBECTL} get rc --namespace=kube-system | grep elastickube-mongo) ]]
then
    ${KUBECTL} create -f elastickube-mongo-rc.yaml
fi

# Ensure mongo service is running
if [[ -z $(${KUBECTL} get svc --namespace=kube-system | grep elastickube-mongo) ]]
then
    ${KUBECTL} create -f elastickube-mongo-svc.yaml
fi

# Delete server replication controller
if [[ -n $(${KUBECTL} get rc --namespace=kube-system | grep elastickube-server) ]]
then
    ${KUBECTL} delete rc elastickube-server --namespace=kube-system
fi

# Wait for replication controller to be deleted
echo -n Waiting for elastickube-server pods to terminate.
while [[ -n $(${KUBECTL} get pod --namespace=kube-system | grep elastickube-server) ]]
do
    sleep 1
    echo -n .
done
echo " done!"

# Rebuild images
docker build --file=${REPO_ROOT}/src/Dockerfile-api    --tag=elasticbox/elastickube-api ${REPO_ROOT}/src
docker build --file=${REPO_ROOT}/src/Dockerfile-charts --tag=elasticbox/elastickube-charts ${REPO_ROOT}/src
docker build --file=${REPO_ROOT}/src/Dockerfile-nginx  --tag=elasticbox/elastickube-nginx ${REPO_ROOT}/src

# Create replication controller
${KUBECTL} create -f elastickube-server-rc.yaml

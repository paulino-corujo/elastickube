#!/bin/bash

cat << \
'______________________________HEADER______________________________'
  _____ _           _   _      _  __     _
 | ____| | __ _ ___| |_(_) ___| |/ /   _| |__   ___
 |  _| | |/ _` / __| __| |/ __| ' / | | | '_ \ / _ \
 | |___| | (_| \__ \ |_| | (__| . \ |_| | |_) |  __/
 |_____|_|\__,_|___/\__|_|\___|_|\_\__,_|_.__/ \___| by ElasticBox

______________________________HEADER______________________________

PROGRESS_WIDTH=40

ELASTICKUBE_MONGO_RC="$(cat << \
______________________________FILE______________________________
apiVersion: v1
kind: ReplicationController
metadata:
  name: elastickube-mongo
  namespace: kube-system
  labels:
    name: elastickube-mongo
spec:
  replicas: 1
  selector:
    name: elastickube-mongo
  template:
    metadata:
      labels:
        name: elastickube-mongo
    spec:
      containers:
        - image: mongo
          name: elastickube-mongo
          args:
          - --replSet=elastickube
          ports:
          - name: mongo
            containerPort: 27017
            hostPort: 27017
          volumeMounts:
            - name: mongo-persistent-storage
              mountPath: /data/mongodb
      volumes:
      - name: mongo-persistent-storage
        hostPath:
          path: /data/mongodb

______________________________FILE______________________________)"


ELASTICKUBE_MONGO_SVC="$(cat << \
______________________________FILE______________________________
apiVersion: v1
kind: Service
metadata:
  name: elastickube-mongo
  namespace: kube-system
  labels:
    name: elastickube-mongo
spec:
  ports:
    - port: 27017
      targetPort: 27017
  selector:
    name: elastickube-mongo
______________________________FILE______________________________)"

ELASTICKUBE_SERVER_RC="$(cat << \
______________________________FILE______________________________
apiVersion: v1
kind: ReplicationController
metadata:
  name: elastickube-server
  namespace: kube-system
  labels:
    name: elastickube-server
spec:
  replicas: 1
  selector:
    name: elastickube-server
  template:
    metadata:
      labels:
        name: elastickube-server
    spec:
      containers:
      - name: elastickube-api
        image: elasticbox/elastickube-api
        resources:
          limits:
            cpu: 100m
            memory: 500Mi
        volumeMounts:
        - name: elastickube-code
          mountPath: /opt/elastickube
        - name: elastickube-run
          mountPath: /var/run
      - name: elastickube-charts
        image: elasticbox/elastickube-charts
        resources:
          limits:
            cpu: 100m
            memory: 500Mi
        volumeMounts:
        - name: elastickube-code
          mountPath: /opt/elastickube
        - name: elastickube-charts
          mountPath: /var/elastickube/charts
      - name: elastickube-nginx
        image: elasticbox/elastickube-nginx
        resources:
          limits:
            cpu: 100m
            memory: 500Mi
        volumeMounts:
        - name: elastickube-code
          mountPath: /opt/elastickube
        - name: elastickube-run
          mountPath: /var/run
        ports:
        - containerPort: 80
          hostPort: 80
          name: http
          protocol: TCP
      volumes:
      - name: elastickube-code
        hostPath:
          path: /opt/elastickube/src
      - name: elastickube-charts
        hostPath:
          path: /var/elastickube/charts
      - name: elastickube-run
        hostPath:
          path: /var/run/elastickube

______________________________FILE______________________________)"

ELASTICKUBE_SERVER_SVC="$(cat << \
______________________________FILE______________________________
apiVersion: v1
kind: Service
metadata:
  name: elastickube-server
  namespace: kube-system
  labels:
    name: elastickube-server
spec:
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 80
  selector:
    name: elastickube-server
______________________________FILE______________________________)"


exec_wait()
{
    eval "$@ > /dev/null 2>&1 >> elastickube.log" &

    local PID=$!
    local SPINNER_DELAY=0.25
    local SPINNER_STR='|/-\'

    while [ "$(ps a | awk '{print $1}' | grep ${PID})" ]
    do
        local TEMP_SPINNER=${SPINNER_STR#?}

        printf "[ %c ] " "${SPINNER_STR}"
        local SPINNER_STR=${TEMP_SPINNER}${SPINNER_STR%"$TEMP_SPINNER"}

        sleep ${SPINNER_DELAY}
        printf "\b\b\b\b\b\b"
    done

    printf "    \b\b\b\b"

    wait ${PID}
    return $?
}

check_tool()
{
    printf "%-${PROGRESS_WIDTH}s" "Checking ${1} is available"
    if which ${1} > /dev/null 2>&1
    then
        echo [ ✓ ]
    else
        echo [ NOT FOUND ] && exit 1
    fi
}

deploy_rc()
{
    printf "%-${PROGRESS_WIDTH}s" "Setting up ${1}"
    if ! exec_wait kubectl --namespace=kube-system get rc ${1}
    then
        exec_wait "echo '${2}' | kubectl create -f -"
    fi

    local COUNTER=0
    until [ ${COUNTER} -ge 60 ] || exec_wait "kubectl --namespace=kube-system describe rc ${1} | grep '0 Waiting / 0 Succeeded / 0 Failed'"
    do
        sleep 5
        COUNTER=$[${COUNTER} + 1]
    done

    if [ ${COUNTER} -lt 60 ]
    then
        echo [ ✓ ]
    else
        echo [ FAILED ] && exit 1
    fi
}

deploy_svc()
{
    printf "%-${PROGRESS_WIDTH}s" "Setting up ${1} svc"
    if ! exec_wait kubectl --namespace=kube-system get svc ${1}
    then
        if exec_wait "echo '${2}' | kubectl create -f -"
        then
            echo [ ✓ ]
        else
            echo [ FAILED ] && exit 1
        fi
    else
        echo [ ✓ ]
    fi
}

# Check gcloud and kubectl is installed
check_tool kubectl

# Check the cluster is configured
printf "%-${PROGRESS_WIDTH}s" "Verifying Kubernetes cluster"
if exec_wait kubectl cluster-info
then
    echo [ ✓ ]
else
    echo [ NOT RUNNING ]
fi

deploy_rc  elastickube-mongo  "${ELASTICKUBE_MONGO_RC}"
deploy_svc elastickube-mongo  "${ELASTICKUBE_MONGO_SVC}"
deploy_rc  elastickube-server "${ELASTICKUBE_SERVER_RC}"
deploy_svc elastickube-server "${ELASTICKUBE_SERVER_SVC}"

printf "%-${PROGRESS_WIDTH}s" "Waiting for LB to be ready"
COUNTER=0
until [ ${COUNTER} -ge 60 ] || exec_wait "kubectl --namespace=kube-system describe svc elastickube-server | grep 'LoadBalancer Ingress:'"
do
    sleep 5
    COUNTER=$[${COUNTER} + 1]
done

if [ ${COUNTER} -lt 60 ]
then
    echo [ ✓ ]
else
    echo [ FAILED ] && exit 1
fi

cat << \
______________________________RESULT______________________________

ElasticKube has been deployed!
$(tput bold)
Please complete the installation here: http://$(kubectl --namespace=kube-system describe svc elastickube-server | grep "LoadBalancer Ingress:" | awk '{print $3}')
$(tput sgr0)
______________________________RESULT______________________________
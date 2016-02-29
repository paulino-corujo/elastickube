#!/bin/bash -e

ELASTICKUBE_VERSION=0.1.0.${BUILD_NUMBER-0}
REPO_ROOT=$(git rev-parse --show-toplevel)

# Build the UI
cd ${REPO_ROOT}/src/ui
npm install
npm run build:production

docker login --username="${DOCKER_USERNAME}" --password="${DOCKER_PASSWORD}" --email="${DOCKER_EMAIL}"

# Build Images
docker build --file=${REPO_ROOT}/src/Dockerfile-api \
   --tag=elasticbox/elastickube-api \
   --tag=elasticbox/elastickube-api:${ELASTICKUBE_VERSION} \
   --tag=elasticbox/elastickube-api:latest \
   ${REPO_ROOT}/src

docker build --file=${REPO_ROOT}/src/Dockerfile-charts \
   --tag=elasticbox/elastickube-charts \
   --tag=elasticbox/elastickube-charts:${ELASTICKUBE_VERSION} \
   --tag=elasticbox/elastickube-charts:latest \
   ${REPO_ROOT}/src

docker build --file=${REPO_ROOT}/src/Dockerfile-nginx \
   --tag=elasticbox/elastickube-nginx \
   --tag=elasticbox/elastickube-nginx:${ELASTICKUBE_VERSION} \
   --tag=elasticbox/elastickube-nginx:latest \
   ${REPO_ROOT}/src

docker push elasticbox/elastickube-api
docker push elasticbox/elastickube-charts
docker push elasticbox/elastickube-nginx

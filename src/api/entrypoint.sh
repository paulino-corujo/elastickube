#!/bin/bash

# Wait for mongo to be up
echo -n "Initializing"
until mongo ${ELASTICKUBE_MONGO_SERVICE_HOST}:${ELASTICKUBE_MONGO_SERVICE_PORT}/admin --eval "db.hostInfo()" > /dev/null 2>&1
do
    echo -n "."
    sleep 10;
done
echo ""

# Ensure user exists in elastickube database
mongo ${ELASTICKUBE_MONGO_SERVICE_HOST}:${ELASTICKUBE_MONGO_SERVICE_PORT}/admin << \
"______________________MONGO_SCRIPT______________________"
var status = rs.status();

if (status.ok === 0 && status.code !== 13) {
  var result = rs.initiate({
      _id:'elastickube',
      version:1,
      members:[ { _id:0, host:'localhost:27017' } ]
  });

  if (result.ok !== 1) {
    print('Cannot initialize replica set:')
    printjson(status);
    quit(1);
  }
}

while (!db.isMaster().ismaster) {
    sleep(1000);
}
______________________MONGO_SCRIPT______________________

# Keep the python server in a loop
while true
do
    python $(dirname $0)/server.py
    sleep 5
done
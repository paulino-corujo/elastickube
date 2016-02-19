FROM python:2.7.11

ENV ELASTICKUBE_PATH    /opt/elastickube
ENV PYTHONPATH          /opt/elastickube/src

WORKDIR ${ELASTICKUBE_PATH}

RUN pip install --no-compile tornado motor GitPython

CMD while true; do (python src/charts/server.py; sleep 5) done

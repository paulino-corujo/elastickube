"""
ElasticBox Confidential
Copyright (c) 2016 All Right Reserved, ElasticBox Inc.

NOTICE:  All information contained herein is, and remains the property
of ElasticBox. The intellectual and technical concepts contained herein are
proprietary and may be covered by U.S. and Foreign Patents, patents in process,
and are protected by trade secret or copyright law. Dissemination of this
information or reproduction of this material is strictly forbidden unless prior
written permission is obtained from ElasticBox
"""

import logging

from api.kube.exceptions import WatchDisconnectedException
from tornado.gen import coroutine, Return


@coroutine
def sync_namespaces(settings):
    logging.info("Initializing watcher...")

    version = None

    def data_callback(data):
        if 'object' in data:
            namespace = data['object']
        else:
            namespace = data

        namespace['_id'] = namespace['metadata']['uid']

        settings['database'].Namespaces.save(namespace)
        version = namespace['metadata']['resourceVersion']

    def done_callback(future):
        logging.warn("Disconnected from kubeclient.")

        if future and future.exception():
            error = future.exception()
            logging.exception(error)

        if future is None or isinstance(future.exception(), WatchDisconnectedException):
            watcher = settings['kube'].namespaces.watch(on_data=data_callback, resource_version=version)
            watcher.add_done_callback(done_callback)

    try:
        settings['kube'].namespaces.watch(on_data=data_callback).add_done_callback(done_callback)

    except Exception as e:
        logging.exception(e)

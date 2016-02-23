import logging

from api.kube.exceptions import WatchDisconnectedException
from tornado.gen import coroutine, Return


@coroutine
def sync_namespaces(settings):
    def data_callback(data):
        namespace = data['object']
        namespace['_id'] = namespace['metadata']['uid']
        settings['database'].Namespaces.save(namespace)

        resource_version = namespace['metadata']['resourceVersion']

    def done_callback(future):
        logging.warn("Disconnected from kubeclient.")

        if future and future.exception():
            error = future.exception()
            logging.exception(error)

        if future is None or isinstance(future.exception(), WatchDisconnectedException):
            watcher = settings['kube'].namespaces.watch(on_data=data_callback, resource_version=resource_version)
            watcher.add_done_callback(done_callback)

    logging.info("Initializing sync_namespaces")
    try:
        result = yield settings['kube'].namespaces.get()
        resource_version = result['metadata']['resourceVersion']
        for item in result.get("items", []):
            item['_id'] = item['metadata']['uid']
            settings['database'].Namespaces.save(item)

        settings['kube'].namespaces.watch(on_data=data_callback, resource_version=resource_version).add_done_callback(
            done_callback)

    except Exception as e:
        logging.exception(e)

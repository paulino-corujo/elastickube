import logging

from api.kube.exceptions import WatchDisconnectedException


class NamespacesWatcher(object):

    def __init__(self, message, settings, callback):
        logging.info("Initializing NamespacesWatcher")

        self.watcher = None
        self.callback = callback
        self.version = None
        self.connected = True

        def done_callback(future):
            logging.warn("Disconnected from kubeclient.")

            if future.exception():
                error = future.exception()
                logging.exception(error)

            if self.connected and isinstance(future.exception(), WatchDisconnectedException):
                self.watcher = settings["kube"].namespaces.watch(
                    on_data=self.data_callback, resource_version=self.version)
                self.watcher.add_done_callback(done_callback)

        try:
            self.watcher = settings["kube"].namespaces.watch(on_data=self.data_callback)
            self.watcher.add_done_callback(done_callback)

        except Exception as e:
            logging.exception(e)
            if self.connected:
                self.callback({"error": {"message": "Failed to connect to event source."}})

    def data_callback(self, data):
        if 'object' in data:
            self.version = data['object']['metadata']['resourceVersion']
        else:
            self.version = data['metadata']['resourceVersion']

        self.callback(data)

    def close(self):
        logging.info("Closing NamespacesWatcher")
        self.connected = False

        if self.watcher:
            self.watcher.cancel()

import logging

from api.kube.exceptions import WatchDisconnectedException


class InstancesWatcher(object):

    def __init__(self, settings, callback):
        logging.info("Initializing InstancesWatcher")

        self.watcher = None
        self.version = None
        self.connected = False

        self.settings = settings
        self.callback = callback
        self.message = None

    def watch(self, message):
        def done_callback(future):
            logging.warn("Disconnected from kubeclient.")

            if future.exception():
                error = future.exception()
                logging.exception(error)

            if self.connected and isinstance(future.exception(), WatchDisconnectedException):
                self.watcher = self.settings["kube"].pods.watch(
                    on_data=self.data_callback,
                    namespace=message['namespace'],
                    resource_version=self.version)

                self.watcher.add_done_callback(done_callback)

        logging.info("Starting watch Instances")
        self.message = message

        # To be retrieved from message
        namespace = 'kube-system'
        self.connected = True
        try:
            self.watcher = self.settings["kube"].pods.watch(
                on_data=self.data_callback,
                namespace=namespace)

            self.watcher.add_done_callback(done_callback)

        except Exception as e:
            logging.exception(e)
            if self.connected:
                self.callback(self.message, {"error": {"message": "Failed to connect to event source."}})

    def data_callback(self, data):
        if 'object' in data:
            self.version = data['object']['metadata']['resourceVersion']
        else:
            self.version = data['metadata']['resourceVersion']

        self.callback(self.message, data, status_code=200)

    def close(self):
        logging.info("Closing InstancesWatcher")
        self.connected = False
        self.message = None

        if self.watcher:
            self.watcher.cancel()

import logging

from tornado.gen import coroutine, Return

from api.kube.exceptions import WatchDisconnectedException


class InstancesWatcher(object):

    def __init__(self, settings, callback):
        logging.info("Initializing InstancesWatcher")

        self.watchers = dict()
        self.connected = False
        self.message = None
        self.namespace = 'default'

        self.settings = settings
        self.callback = callback

    @coroutine
    def watch(self, message):
        def done_callback(future):
            logging.warn("Disconnected from kubeclient.")

            if future.exception():
                error = future.exception()
                logging.exception(error)

            if self.connected and isinstance(future.exception(), WatchDisconnectedException):
                self.watcher = self.settings["kube"].pods.watch(
                    on_data=self.data_callback,
                    namespace=self.namespace,
                    resource_version=self.version)

                self.watcher.add_done_callback(done_callback)

        logging.info("Starting watch Instances")
        if len(self.watchers.keys()) > 0:
            self.unwatch()

        self.message = message
        if 'body' in self.message and 'namespace' in self.message['body']:
            self.namespace = self.message['body']['namespace']

        yield self.initialize_data()

        self.connected = True
        try:
            logging.debug('Starting watch Instances connected')
            logging.debug(self.watchers.keys())

            self.watchers['PodList']['watcher'] = self.settings["kube"].pods.watch(
                on_data=self.data_callback,
                namespace=self.namespace,
                resource_version=self.watchers['PodList']['resourceVersion']
            )

            self.watchers['PodList']['watcher'].add_done_callback(done_callback)

            logging.debug(self.watchers.keys())
            self.watchers['ReplicationControllerList']['watcher'] = self.settings["kube"].pods.watch(
                on_data=self.data_callback,
                namespace=self.namespace,
                resource_version=self.watchers['ReplicationControllerList']['resourceVersion']
            )

            self.watchers['ReplicationControllerList']['watcher'].add_done_callback(done_callback)

        except Exception as e:
            logging.exception(e)
            if self.connected:
                self.callback(self.message, {"error": {"message": "Failed to connect to event source."}})

    @coroutine
    def data_callback(self, data):
        watcher_key = data['object']['kind'] + "List"
        self.watchers[watcher_key]["resourceVersion"] = data['object']['metadata']['resourceVersion']

        operation = "updated"
        if data["type"] == "ADDED":
            operation = "created"
        elif data["type"] == "REMOVED":
            operation = "deleted"

        response = dict(
            action=self.message["action"],
            operation=operation,
            status_code=200,
            body=data["object"]
        )

        self.callback(response)
        raise Return()

    @coroutine
    def initialize_data(self):
        result = yield self.settings["kube"].pods.get(namespace=self.namespace)
        self.watchers[result['kind']] = dict(resourceVersion=result['metadata']['resourceVersion'])
        items = result.get("items", [])

        result = yield self.settings["kube"].replication_controllers.get(namespace=self.namespace)
        self.watchers[result['kind']] = dict(resourceVersion=result['metadata']['resourceVersion'])
        items.extend(result.get("items", []))
        response = dict(
            action=self.message["action"],
            operation="watched",
            correlation=self.message["correlation"],
            status_code=200,
            body=items
        )

        self.callback(response)

    def unwatch(self):
        logging.info("Stopping watch Instances for namespace %s" % self.namespace)
        for watcher in self.watchers.values():
            if 'watcher' in watcher:
                watcher['watcher'].cancel()

        self.watchers = dict()
        self.connected = False
        self.message = None
        self.namespace = 'default'

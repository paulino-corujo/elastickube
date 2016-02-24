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
                logging.exception(future.exception())

            if self.connected and isinstance(future.exception(), WatchDisconnectedException):
                for k, v in self.watchers.items():
                    if v['watcher'] == future:
                        self.watchers[k]['watcher'] = self.settings["kube"].pods.watch(
                            on_data=self.data_callback,
                            namespace=self.namespace,
                            resource_version=self.watchers['PodList']['resourceVersion'])

                        self.watchers[k]['watcher'].add_done_callback(done_callback)

        logging.info("Starting watch Instances")
        self.message = message
        if 'body' in self.message and 'namespace' in self.message['body']:
            self.namespace = self.message['body']['namespace']

        if len(self.watchers.keys()) > 0:
            self.unwatch()

        yield self.initialize_data()

        self.connected = True
        try:
            logging.debug('Starting watch Instances connected')

            self.watchers['PodList']['watcher'] = self.settings["kube"].pods.watch(
                on_data=self.data_callback,
                namespace=self.namespace,
                resource_version=self.watchers['PodList']['resourceVersion']
            )

            self.watchers['PodList']['watcher'].add_done_callback(done_callback)

            self.watchers['ReplicationControllerList']['watcher'] = self.settings["kube"].pods.watch(
                namespace=self.namespace,
                resource_version=self.watchers['ReplicationControllerList']['resourceVersion'],
                on_data=self.data_callback
            )

            self.watchers['ReplicationControllerList']['watcher'].add_done_callback(done_callback)

        except Exception as e:
            logging.exception(e)
            if self.connected:
                self.callback(dict(
                    action=self.message["action"],
                    operation="watched",
                    status_code=400,
                    correlation=self.message["correlation"],
                    body={"error": {"message": "Failed to connect to event source."}},
                ))

    @coroutine
    def data_callback(self, data):
        logging.info("InstancesWatcher data_callback")

        watcher_key = data['object']['kind'] + "List"
        self.watchers[watcher_key]["resourceVersion"] = data['object']['metadata']['resourceVersion']

        operation = "updated"
        if data["type"] == "ADDED":
            operation = "created"
        elif data["type"] == "DELETED":
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
            status_code=200,
            body=items
        )

        if "correlation" in self.message:
            response["correlation"] = self.message["correlation"]

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

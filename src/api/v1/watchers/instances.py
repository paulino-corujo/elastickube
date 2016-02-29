import logging

from tornado.gen import coroutine, Return

from api.kube.exceptions import WatchDisconnectedException

RESOURCES_LIST_MAP = {
    'PodList': 'pods',
    'ReplicationControllerList': 'replication_controllers',
    'ServiceList': 'services'
}


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
                for watcher_key, watcher_value in self.watchers.iteritems():
                    if watcher_value['watcher'] == future:
                        resource_name = RESOURCES_LIST_MAP[watcher_key]
                        self.watchers[watcher_key]['watcher'] = self.settings["kube"][resource_name].watch(
                            on_data=self.data_callback,
                            namespace=self.namespace,
                            resource_version=self.watchers[watcher_key]['resourceVersion'])

                        self.watchers[watcher_key]['watcher'].add_done_callback(done_callback)
                        logging.debug("Reconnected watcher for %s " % watcher_key)

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

            for resource_list, resource in RESOURCES_LIST_MAP.iteritems():
                self.watchers[resource_list]['watcher'] = self.settings["kube"][resource].watch(
                    on_data=self.data_callback,
                    namespace=self.namespace,
                    resource_version=self.watchers[resource_list]['resourceVersion']
                )

                self.watchers[resource_list]['watcher'].add_done_callback(done_callback)
                logging.debug("Added watcher for %s " % resource_list)

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

        resource_list = data['object']['kind'] + "List"
        self.watchers[resource_list]["resourceVersion"] = data['object']['metadata']['resourceVersion']

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
        items = []

        for resource in RESOURCES_LIST_MAP.itervalues():
            result = yield self.settings["kube"][resource].get(namespace=self.namespace)
            self.watchers[result['kind']] = dict(resourceVersion=result['metadata']['resourceVersion'])

            resources = []
            for item in result.get("items", []):
                item["kind"] = result["kind"].replace("List", "")
                resources.append(item)

            items.extend(resources)

        self.callback(dict(
            action=self.message["action"],
            operation="watched",
            correlation=self.message["correlation"],
            status_code=200,
            body=items
        ))

    def unwatch(self):
        logging.info("Stopping watch Instances for namespace %s" % self.namespace)
        for watcher in self.watchers.values():
            if 'watcher' in watcher:
                watcher['watcher'].cancel()

        self.watchers = dict()
        self.connected = False
        self.message = None
        self.namespace = 'default'

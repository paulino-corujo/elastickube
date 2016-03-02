class InstancesActionCreatorService {
    constructor(actions, dispatcher, instancesAPI, namespacesStore) {
        'ngInject';

        this._instancesAPI = instancesAPI;
        this._actions = actions;
        this._dispatcher = dispatcher;
        this._namespacesStore = namespacesStore;

        instancesAPI.addOnCreatedListener((instance) => this._dispatcher.dispatch({
            type: this._actions.INSTANCE_DEPLOYED,
            instances: [instance]
        }));

        instancesAPI.addOnUpdatedListener((instance) => this._dispatcher.dispatch({ type: this._actions.INSTANCES_UPDATED, instance }));
        instancesAPI.addOnDeletedListener((instance) => this._dispatcher.dispatch({ type: this._actions.INSTANCES_DELETED, instance }));
    }

    deploy(namespace, chart, info) {
        const body = {
            uid: chart._id.$oid,
            namespace: _.get(namespace, 'metadata.name'),
            labels: info.labels
        };

        this._dispatcher.dispatch({ type: this._actions.INSTANCE_DEPLOY });

        return this._instancesAPI.create(body)
            .then((instances) => this._dispatcher.dispatch({ type: this._actions.INSTANCE_DEPLOYED, instances }));
    }

    subscribe(namespace) {
        this._dispatcher.dispatch({ type: this._actions.INSTANCES_SUBSCRIBE, namespace });

        return this._instancesAPI.subscribe({ namespace: namespace.metadata.name })
            .then((instances) => this._dispatcher.dispatch({ type: this._actions.INSTANCES_SUBSCRIBED, namespace, instances }));
    }

    unsubscribe(namespace) {
        this._dispatcher.dispatch({
            type: this._actions.INSTANCES_UNSUBSCRIBE,
            namespace
        });

        return this._instancesAPI.unsubscribe({ namespace: namespace.metadata.name })
            .then((x) => this._dispatcher.dispatch({
                type: this._actions.INSTANCES_UNSUBSCRIBED,
                namespace: this._namespacesStore.get(x)
            }));
    }
}

export default InstancesActionCreatorService;

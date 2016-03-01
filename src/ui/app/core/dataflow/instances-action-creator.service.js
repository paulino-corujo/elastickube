class InstancesActionCreatorService {
    constructor(actions, dispatcher, instancesAPI, namespacesStore) {
        'ngInject';

        this._instancesAPI = instancesAPI;
        this._actions = actions;
        this._dispatcher = dispatcher;
        this._namespacesStore = namespacesStore;
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

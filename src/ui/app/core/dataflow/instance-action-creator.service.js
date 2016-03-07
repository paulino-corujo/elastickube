class EventsActionCreatorService {
    constructor(actions, dispatcher, instanceAPI) {
        'ngInject';

        this._actions = actions;
        this._dispatcher = dispatcher;
        this._instanceAPI = instanceAPI;

        instanceAPI.addOnCreatedListener((item) => this._dispatcher.dispatch({ type: this._actions.INSTANCE_CREATED, item }));
        instanceAPI.addOnUpdatedListener((item) => this._dispatcher.dispatch({ type: this._actions.INSTANCE_UPDATED, item }));
        instanceAPI.addOnDeletedListener((item) => this._dispatcher.dispatch({ type: this._actions.INSTANCE_DELETED, item }));
    }

    subscribe(instance) {
        this._dispatcher.dispatch({ type: this._actions.INSTANCE_SUBSCRIBE, instance });

        return this._instanceAPI.subscribe({ namespace: instance.metadata.namespace, kind: instance.kind, name: instance.metadata.name })
            .then((items) => this._dispatcher.dispatch({ type: this._actions.INSTANCE_SUBSCRIBED, items }));
    }

    unsubscribe(instance) {
        this._dispatcher.dispatch({ type: this._actions.INSTANCE_UNSUBSCRIBE, instance });

        return this._instanceAPI.unsubscribe({ namespace: instance.metadata.namespace, kind: instance.kind, name: instance.metadata.name })
            .then(() => this._dispatcher.dispatch({ type: this._actions.INSTANCE_UNSUBSCRIBED, instance }));
    }
}

export default EventsActionCreatorService;

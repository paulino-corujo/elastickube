class InstancesActionCreatorService {
    constructor(actions, dispatcher, instancesAPI) {
        'ngInject';

        this._instancesAPI = instancesAPI;
        this._actions = actions;
        this._dispatcher = dispatcher;
    }

    subscribe(namespace) {
        this._dispatcher.dispatch({
            type: this._actions.INSTANCES_SUBSCRIBE
        });
        return this._instancesAPI.subscribe(namespace);
    }
}

export default InstancesActionCreatorService;

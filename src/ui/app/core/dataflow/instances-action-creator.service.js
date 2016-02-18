class InstancesActionCreatorService {
    constructor(actions, dispatcher, instancesAPI) {
        'ngInject';

        this._instancesAPI = instancesAPI;
        this._actions = actions;
        this._dispatcher = dispatcher;
    }

    load(namespace) {
        this._dispatcher.dispatch({
            type: this._actions.INSTANCES_LOAD
        });
        return this._instancesAPI.loadInstances(namespace).then((instances) => {
            this._dispatcher.dispatch({
                type: this._actions.INSTANCES_LOADED,
                instances
            });
        });
    }
}

export default InstancesActionCreatorService;

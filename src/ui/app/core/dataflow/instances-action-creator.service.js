class InstancesActionCreatorService {
    constructor($q, actions, dispatcher) {
        'ngInject';

        this._$q = $q;
        this._actions = actions.api;
        this._dispatcher = dispatcher;
    }

    preload() {
        this._dispatcher.dispatch({
            type: this._actions.PRELOAD_INSTANCES
        });
    }

    instancesLoaded(instances) {
        this._dispatcher.dispatch({
            type: this._actions.INSTANCES_LOADED,
            instances
        });
    }

    instancesPreloaded(instances) {
        this._dispatcher.dispatch({
            type: this._actions.INSTANCES_PRELOADED,
            instances
        });
    }
}

export default InstancesActionCreatorService;

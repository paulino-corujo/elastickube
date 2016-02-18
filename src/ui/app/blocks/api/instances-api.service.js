import mockInstances from 'mocks/instances';

class InstancesAPIService {

    constructor(instancesActionCreator, actions, dispatcher) {
        'ngInject';

        this._actions = actions;
        this._dispatcher = dispatcher;
        this._instancesActionCreator = instancesActionCreator;

        this.dispatchToken = dispatcher.register((x) => this._apiDispatcher(x));
    }

    _apiDispatcher(action) {
        switch (action.type) {

            case this._actions.api.PRELOAD_INSTANCES:

                // FIXME SIMULATED CALLBACK
                setTimeout(() => this._instancesActionCreator.instancesPreloaded(mockInstances.default), 0);
                break;

            case this._actions.ui.NAMESPACE_SELECTED:

                // FIXME SIMULATED CALLBACK
                setTimeout(() => this._instancesActionCreator.instancesLoaded(mockInstances[action.namespace]), 0);
                break;

            default:
        }
    }
}

export default InstancesAPIService;

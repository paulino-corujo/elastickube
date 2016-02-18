import mockNamespaces from 'mocks/namespaces';

class InstancesAPIService {

    constructor(namespacesActionCreator, actions, dispatcher) {
        'ngInject';

        this._actions = actions;
        this._dispatcher = dispatcher;
        this._namespacesActionCreator = namespacesActionCreator;

        this.dispatchToken = dispatcher.register((x) => this._apiDispatcher(x));
    }

    _apiDispatcher(action) {
        switch (action.type) {
            case this._actions.api.PRELOAD_NAMESPACES:

                /* FIXME SIMULATED CALLBACK */
                setTimeout(() => this._namespacesActionCreator.namespacesPreloaded(mockNamespaces), 0);
                break;
            default:
        }
    }
}

export default InstancesAPIService;

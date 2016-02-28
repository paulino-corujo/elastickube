class InstancesActionCreatorService {
    constructor(actions, dispatcher, instancesAPI) {
        'ngInject';

        this._instancesAPI = instancesAPI;
        this._actions = actions;
        this._dispatcher = dispatcher;
    }

    deploy(chart, deployInfo) {
        this._dispatcher.dispatch({ type: this._actions.INSTANCE_DEPLOY });

        return this._instancesAPI.deploy(chart, deployInfo)
            .then((newInstance) => this._dispatcher.dispatch({ type: this._actions.INSTANCE_DEPLOYED, newInstance }));
    }
}

export default InstancesActionCreatorService;

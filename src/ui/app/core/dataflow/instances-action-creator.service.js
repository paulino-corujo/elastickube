class InstancesActionCreatorService {
    constructor(actions, dispatcher, instancesAPI) {
        'ngInject';

        this._instancesAPI = instancesAPI;
        this._actions = actions;
        this._dispatcher = dispatcher;
    }

    deploy(chart, deployInfo) {
        const deployBody = {
            uid: chart._id.$oid,
            labels: deployInfo.labels,
            name: deployInfo.name
        };

        this._dispatcher.dispatch({ type: this._actions.INSTANCE_DEPLOY });

        return this._instancesAPI.deploy(deployBody)
            .then((newInstance) => this._dispatcher.dispatch({ type: this._actions.INSTANCE_DEPLOYED, newInstance }));
    }
}

export default InstancesActionCreatorService;

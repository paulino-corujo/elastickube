class InstanceActionCreatorService {
    constructor(actions, dispatcher, instanceAPI) {
        'ngInject';

        this._instanceAPI = instanceAPI;
        this._actions = actions;
        this._dispatcher = dispatcher;
    }

    deploy(chart, info) {
        const body = {
            uid: chart._id.$oid,
            labels: info.labels,
            name: info.name
        };

        this._dispatcher.dispatch({ type: this._actions.INSTANCE_DEPLOY });

        return this._instanceAPI.create(body)
            .then((newInstance) => this._dispatcher.dispatch({ type: this._actions.INSTANCE_DEPLOYED, newInstance }));
    }
}

export default InstanceActionCreatorService;

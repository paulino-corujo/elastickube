import constants from './constants';

class SessionActionCreatorService {
    constructor(actions, dispatcher, session, instancesAPI) {
        'ngInject';

        this._actions = actions;
        this._session = session;
        this._instancesAPI = instancesAPI;
        this._dispatcher = dispatcher;
    }

    selectNamespace(namespace) {
        this._dispatcher.dispatch({
            type: this._actions.NAMESPACE_CHANGE,
            namespace
        });

        return this._session.setItem(constants.ACTIVE_NAMESPACE, namespace)
            .then(() => {
                this._dispatcher.dispatch({
                    type: this._actions.NAMESPACE_CHANGED
                });
                return this._instancesAPI.loadInstances(namespace);
            })
            .then((instances) => {
                this._dispatcher.dispatch({
                    type: this._actions.INSTANCES_LOADED,
                    instances
                });
            });
    }
}

export default SessionActionCreatorService;

class NamespacesActionCreatorService {
    constructor(actions, dispatcher, namespacesAPI) {
        'ngInject';

        this._actions = actions;
        this._namespacesAPI = namespacesAPI;
        this._dispatcher = dispatcher;
    }

    subscribe() {
        this._dispatcher.dispatch({
            type: this._actions.NAMESPACES_SUBSCRIBE
        });
        return this._namespacesAPI.subscribe();
    }
}

export default NamespacesActionCreatorService;

class NamespacesActionCreatorService {
    constructor(actions, dispatcher, namespacesAPI) {
        'ngInject';

        this._actions = actions;
        this._namespacesAPI = namespacesAPI;
        this._dispatcher = dispatcher;
    }

    load() {
        this._dispatcher.dispatch({
            type: this._actions.NAMESPACES_LOAD
        });
        return this._namespacesAPI.loadNamespaces()
            .then((namespaces) => {
                this._dispatcher.dispatch({
                    type: this._actions.NAMESPACES_LOADED,
                    namespaces
                });
            });
    }
}

export default NamespacesActionCreatorService;

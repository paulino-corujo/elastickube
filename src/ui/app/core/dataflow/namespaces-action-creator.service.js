class NamespacesActionCreatorService {
    constructor(actions, confirmDialog, dispatcher, namespacesAPI) {
        'ngInject';

        this._actions = actions;
        this._confirmDialog = confirmDialog;
        this._namespacesAPI = namespacesAPI;
        this._dispatcher = dispatcher;
    }

    subscribe() {
        this._dispatcher.dispatch({ type: this._actions.NAMESPACES_SUBSCRIBE });

        return this._namespacesAPI.subscribe()
            .then((namespaces) => this._dispatcher.dispatch({ type: this._actions.NAMESPACES_SUBSCRIBED, namespaces }));
    }

    createNamespace(namespaceName, users) {
        const createBody = {
            name: namespaceName,
            users
        };

        return this._namespacesAPI.create(createBody);
    }
}

export default NamespacesActionCreatorService;

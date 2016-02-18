class UIActionCreatorService {
    constructor(actions, dispatcher) {
        'ngInject';

        this._actions = actions.ui;
        this._dispatcher = dispatcher;
    }

    namespaceSelected(namespace) {
        this._dispatcher.dispatch({
            type: this._actions.NAMESPACE_SELECTED,
            namespace
        });
    }
}

export default UIActionCreatorService;

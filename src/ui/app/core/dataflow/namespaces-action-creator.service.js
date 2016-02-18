class NamespacesActionCreatorService {
    constructor($q, actions, dispatcher) {
        'ngInject';

        this._$q = $q;
        this._actions = actions.api;
        this._dispatcher = dispatcher;
    }

    preload() {
        this._dispatcher.dispatch({
            type: this._actions.PRELOAD_NAMESPACES
        });
    }

    namespacesPreloaded(namespaces) {
        this._dispatcher.dispatch({
            type: this._actions.NAMESPACES_PRELOADED,
            namespaces
        });
    }
}
export default NamespacesActionCreatorService;

import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

class NamespacesStoreService extends EventEmitter {
    constructor($q, actions, dispatcher) {
        'ngInject';

        super();

        this._$q = $q;
        this._actions = actions;
        this._loading = this._$q.defer();

        this.dispatchToken = dispatcher.register((action) => {
            switch (action.type) {

                case this._actions.api.NAMESPACES_PRELOADED:
                    this._loading.resolve();
                    this._setNamespaces(action.namespaces);
                    this._activeNamespace = action.namespaces[0];
                    this.emit(CHANGE_EVENT);
                    break;

                default:
            }
        });
    }

    _setNamespaces(namespaces) {
        this._namespaces = namespaces;
    }

    loading() {
        return this._loading.promise;
    }

    getAll() {
        return this._namespaces;
    }

    getActiveNamespace() {
        return this._activeNamespace;
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}

export default NamespacesStoreService;

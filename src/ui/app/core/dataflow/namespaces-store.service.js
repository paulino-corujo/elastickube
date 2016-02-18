import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

class NamespacesStoreService extends EventEmitter {
    constructor($q, actions, dispatcher) {
        'ngInject';

        super();

        this._$q = $q;
        this._actions = actions;

        this.dispatchToken = dispatcher.register((action) => {
            switch (action.type) {

                case this._actions.NAMESPACES_LOAD:
                    this._isLoading = this._$q.defer();
                    break;

                case this._actions.NAMESPACES_LOADED:
                    this._setNamespaces(action.namespaces);
                    this._isLoading.resolve();
                    this.emit(CHANGE_EVENT);
                    break;

                default:
            }
        });
    }

    _setNamespaces(namespaces) {
        this._namespaces = namespaces;
    }

    getAll() {
        return this._namespaces;
    }

    getActiveNamespace() {
        return this._activeNamespace;
    }

    isLoading() {
        return this._isLoading.promise;
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}

export default NamespacesStoreService;

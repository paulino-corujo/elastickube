import AbstractStore from './abstract-store';

const CHANGE_EVENT = 'change';

class NamespacesStoreService extends AbstractStore {
    constructor($q, session, actions, dispatcher) {
        'ngInject';

        super(session);

        this._$q = $q;
        this._actions = actions;
        this._namespaces = {};

        this.dispatchToken = dispatcher.register((action) => {
            switch (action.type) {

                case this._actions.NAMESPACES_SUBSCRIBE:
                    this._isLoading = this._$q.defer();
                    break;

                case this._actions.NAMESPACES_SUBSCRIBED:
                    this._setNamespaces(action.namespaces);
                    this._isLoading.resolve();
                    this.emit(CHANGE_EVENT);
                    break;

                case this._actions.NAMESPACES_UPDATED:
                    if (action.operation === 'deleted') {
                        this._removeNamespace(action.namespace);
                    } else {
                        this._setNamespace(action.namespace);
                    }
                    this.emit(CHANGE_EVENT);
                    break;

                default:
            }
        });
    }

    _setNamespace(namespace) {
        this._namespaces[namespace.metadata.uid] = namespace;
    }

    _setNamespaces(namespaces) {
        const newNamespaces = {};

        _.each(namespaces, (x) => newNamespaces[x.metadata.uid] = x);

        this._namespaces = newNamespaces;
    }

    _removeNamespace(namespace) {
        delete this._namespaces[namespace.metadata.uid];
    }

    destroy() {
        this._namespaces = {};
    }

    getAll() {
        return _.values(this._namespaces);
    }

    get(uid) {
        return this._namespaces[uid];
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

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

                default:
            }
        });
    }

    _setNamespaces(namespaces) {
        this._namespaces = _.reduce(namespaces, (memo, namespace) => {
            memo[namespace.metadata.uid] = namespace;

            return memo;
        }, this._namespaces);
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

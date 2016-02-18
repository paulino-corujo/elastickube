import { EventEmitter } from 'events';

const NAMESPACE_UPDATED_EVENT = 'namespace.change';

const sessionKeys = {
    ACTIVE_NAMESPACE: 'ACTIVE_NAMESPACE'
};

class SessionStoreService extends EventEmitter {
    constructor($q, actions, dispatcher, session) {
        'ngInject';

        super();

        this._$q = $q;
        this._actions = actions;
        this._session = session;

        this.dispatchToken = dispatcher.register((action) => {
            switch (action.type) {

                case this._actions.ui.NAMESPACE_SELECTED:
                    session.setItem(sessionKeys.ACTIVE_NAMESPACE, action.namespace);
                    this.emit(NAMESPACE_UPDATED_EVENT);
                    break;

                default:
            }
        });
    }

    getActiveNamespace() {
        return this._session.getItem(sessionKeys.ACTIVE_NAMESPACE);
    }

    addNamespaceChangeListener(callback) {
        this.on(NAMESPACE_UPDATED_EVENT, callback);
    }

    removeNamespaceChangeListener(callback) {
        this.removeListener(NAMESPACE_UPDATED_EVENT, callback);
    }
}

export default SessionStoreService;

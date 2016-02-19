import AbstractStore from './abstract-store';
import constants from './constants';

const NAMESPACE_UPDATED_EVENT = 'namespace.change';

class SessionStoreService extends AbstractStore {
    constructor(session, actions, dispatcher) {
        'ngInject';

        super(session);

        this._actions = actions;
        this._session = session;

        this.dispatchToken = dispatcher.register((action) => {
            switch (action.type) {

                case this._actions.NAMESPACE_CHANGED:
                    this.emit(NAMESPACE_UPDATED_EVENT);
                    break;

                default:
            }
        });
    }

    destroy() {
    }

    getActiveNamespace() {
        return this._session.getItem(constants.ACTIVE_NAMESPACE);
    }

    getSessionToken() {
        return this._session.getItem(constants.SESSION_TOKEN);
    }

    addNamespaceChangeListener(callback) {
        this.on(NAMESPACE_UPDATED_EVENT, callback);
    }

    removeNamespaceChangeListener(callback) {
        this.removeListener(NAMESPACE_UPDATED_EVENT, callback);
    }
}

export default SessionStoreService;

import { EventEmitter } from 'events';
import constants from './constants';

const NAMESPACE_UPDATED_EVENT = 'namespace.change';

class SessionStoreService extends EventEmitter {
    constructor(actions, dispatcher, session) {
        'ngInject';

        super();

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

    getActiveNamespace() {
        return this._session.getItem(constants.ACTIVE_NAMESPACE);
    }

    addNamespaceChangeListener(callback) {
        this.on(NAMESPACE_UPDATED_EVENT, callback);
    }

    removeNamespaceChangeListener(callback) {
        this.removeListener(NAMESPACE_UPDATED_EVENT, callback);
    }
}

export default SessionStoreService;

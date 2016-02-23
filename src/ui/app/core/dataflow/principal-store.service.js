import AbstractStore from './abstract-store';

const CHANGE_EVENT = 'change';

class UserStoreService extends AbstractStore {
    constructor(session, actions, dispatcher) {
        'ngInject';

        super(session);

        this._actions = actions;

        this.dispatchToken = dispatcher.register((action) => {
            switch (action.type) {
                case this._actions.PRINCIPAL_LOGGED:
                    this._principal = action.principal;
                    this.emit(CHANGE_EVENT);
                    break;

                case this._actions.SESSION_DESTROYED:
                case this._actions.PRINCIPAL_LOGOUT:
                    delete this._principal;
                    this.emit(CHANGE_EVENT);
                    break;

                default:
            }
        });
    }

    destroy() {
        delete this._principal;
    }

    getPrincipal() {
        return this._principal;
    }

    isAdmin() {
        return this._principal;
    }

    addPrincipalChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removePrincipalChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}

export default UserStoreService;

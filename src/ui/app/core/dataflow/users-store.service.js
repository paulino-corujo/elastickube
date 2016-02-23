import AbstractStore from './abstract-store';

const CHANGE_EVENT = 'change';

class UsersStoreService extends AbstractStore {
    constructor($q, session, actions, dispatcher) {
        'ngInject';

        super(session);

        this._$q = $q;
        this._actions = actions;

        this.dispatchToken = dispatcher.register((action) => {
            switch (action.type) {

                case this._actions.USERS_SUBSCRIBE:
                    this._isLoading = this._$q.defer();
                    break;

                case this._actions.USERS_SUBSCRIBED:
                    this._setUsers(action.users);
                    this._isLoading.resolve();
                    this.emit(CHANGE_EVENT);
                    break;

                default:
            }
        });
    }

    _setUsers(users) {
        this._users = users;
    }

    destroy() {
        delete this._users;
    }

    get(id) {
        return _.find(this._users, { id });
    }

    getAll() {
        return this._users;
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

export default UsersStoreService;

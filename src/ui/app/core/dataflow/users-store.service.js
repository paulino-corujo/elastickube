import AbstractStore from './abstract-store';

const CHANGE_EVENT = 'change';

class UsersStoreService extends AbstractStore {
    constructor($q, session, actions, dispatcher) {
        'ngInject';

        super(session);

        this._$q = $q;
        this._actions = actions;
        this._users = {};

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

                case this._actions.USERS_UPDATED:
                    if (action.operation === 'deleted') {
                        this._removeUser(action.user);
                    } else {
                        this._setUser(action.user);
                    }
                    this.emit(CHANGE_EVENT);
                    break;

                default:
            }
        });
    }

    _setUser(user) {
        this._users[user.username] = user;
    }

    _setUsers(users) {
        const newUsers = {};

        _.each(users, (x) => newUsers[x.username] = x);

        this._users = newUsers;
    }

    _removeUser(user) {
        delete this._users[user.username];
    }

    destroy() {
        this._users = {};
    }

    get(username) {
        return this._users[username];
    }

    getAll() {
        return _.values(this._users);
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

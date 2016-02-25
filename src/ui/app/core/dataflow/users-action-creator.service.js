class UsersActionCreatorService {
    constructor(actions, dispatcher, usersAPI) {
        'ngInject';

        this._actions = actions;
        this._dispatcher = dispatcher;
        this._usersAPI = usersAPI;

        usersAPI.addOnUpdatedListener((users) => this._dispatcher.dispatch({ type: this._actions.USERS_UPDATED, users }));
    }

    subscribe() {
        this._dispatcher.dispatch({ type: this._actions.USERS_SUBSCRIBE });

        return this._usersAPI.subscribe()
            .then((users) => this._dispatcher.dispatch({ type: this._actions.USERS_SUBSCRIBED, users }));
    }

    update(user) {
        this._dispatcher.dispatch({ type: this._actions.USERS_UPDATE, user });

        return this._usersAPI.update(user)
            .then((updatedUser) => this._dispatcher.dispatch({ type: this._actions.USERS_UPDATED, user: updatedUser }));
    }
}

export default UsersActionCreatorService;

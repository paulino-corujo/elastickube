class UsersActionCreatorService {
    constructor(actions, dispatcher, usersAPI) {
        'ngInject';

        this._actions = actions;
        this._dispatcher = dispatcher;
        this._usersAPI = usersAPI;
    }

    load() {
        this._dispatcher.dispatch({
            type: this._actions.USERS_LOAD
        });
        return this._usersAPI.loadUsers()
            .then((users) => {
                this._dispatcher.dispatch({
                    type: this._actions.USERS_LOADED,
                    users
                });
            });
    }
}

export default UsersActionCreatorService;

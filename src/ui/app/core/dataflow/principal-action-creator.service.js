class PrincipalActionCreatorService {

    constructor($q, actions, dispatcher, principalAPI, usersStore) {
        'ngInject';

        this._$q = $q;
        this._actions = actions;
        this._principalAPI = principalAPI;
        this._dispatcher = dispatcher;
        this._userStoreService = usersStore;
    }

    signup(user) {
        this._dispatcher.dispatch({ type: this._actions.PRINCIPAL_SIGN_UP });

        return this._principalAPI.signup(user);
    }

    login(user) {
        this._dispatcher.dispatch({ type: this._actions.PRINCIPAL_LOGIN });

        return this._principalAPI.login(user);
    }

    loggedIn() {
        this._dispatcher.dispatch({
            type: this._actions.PRINCIPAL_LOGGED,
            principal: {}
        });

        // TODO Principal should be queried from the services
    }

    logout() {
        return this._$q.when(this._dispatcher.dispatch({ type: this._actions.PRINCIPAL_LOGOUT }));
    }
}

export default PrincipalActionCreatorService;

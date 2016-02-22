// FIXME this mock should be removed when user API is ready
import mockUsers from 'mocks/users';

class PrincipalActionCreatorService {

    constructor($q, actions, dispatcher, principalAPI) {
        'ngInject';

        this._$q = $q;
        this._actions = actions;
        this._principalAPI = principalAPI;
        this._dispatcher = dispatcher;
    }

    signup(user) {
        this._dispatcher.dispatch({
            type: this._actions.PRINCIPAL_SIGN_UP
        });

        return this._principalAPI.signup(user);
    }

    login(user) {
        this._dispatcher.dispatch({
            type: this._actions.PRINCIPAL_LOGIN
        });

        return this._principalAPI.login(user);
    }

    loggedIn() {
        return this._$q.when(_.find(mockUsers, { id: 'alberto' }))
            .then((principal) => {
                this._dispatcher.dispatch({
                    type: this._actions.PRINCIPAL_LOGGED,
                    principal
                });
            });
    }

    logout() {
        return this._$q.when(this._dispatcher.dispatch({
            type: this._actions.PRINCIPAL_LOGOUT
        }));
    }
}

export default PrincipalActionCreatorService;

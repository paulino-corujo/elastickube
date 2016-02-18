// FIXME this mock should be removed when user API is ready
import mockWorkspaces from 'mocks/workspaces';

class PrincpalActionCreatorService {

    constructor($q, actions, dispatcher, principalAPI) {
        'ngInject';

        this._$q = $q;
        this._actions = actions;
        this._principalAPI = principalAPI;
        this._dispatcher = dispatcher;
    }

    signup(user) {
        this._dispatcher.dispatch({
            type: this._actions.USER_SIGN_UP
        });

        return this._principalAPI.signup(user).then(() => {
            this._dispatcher.dispatch({
                type: this._actions.USER_SIGNED_UP,
                principal: user
            });
        });
    }

    login(user) {
        this._dispatcher.dispatch({
            type: this._actions.USER_LOGIN
        });

        return this._principalAPI.login(user).then(() => {
            this._dispatcher.dispatch({
                type: this._actions.USER_LOGGED,
                principal: _.find(mockWorkspaces, { id: 'alberto' })
            });
        });
    }

    logout() {
        return this._$q.when(this._dispatcher.dispatch({
            type: this._actions.USER_LOGOUT
        }));
    };
}

export default PrincpalActionCreatorService;

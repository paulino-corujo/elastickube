import constants from 'constants';
import profiles from './profiles';

class AuthService {
    constructor($cookies, initialization, loginNavigationActionCreator, principalStore, routerHelper, sessionActionCreator, sessionStore, websocketClient) {
        'ngInject';
        let sessionToken = $cookies.get(constants.SESSION_TOKEN_NAME);

        this._$cookies = $cookies;
        this._loginNavigationActionCreator = loginNavigationActionCreator;
        this._principalStore = principalStore;
        this._routerHelper = routerHelper;
        this._sessionActionCreator = sessionActionCreator;
        this._sessionStore = sessionStore;
        this._websocketClient = websocketClient;

        if (_.isUndefined(sessionToken)) {
            sessionToken = this._sessionStore.getSessionToken();

            if (_.isUndefined(sessionToken)) {
                initialization.initializeUnloggedUser();
            } else {
                $cookies.put(constants.SESSION_TOKEN_NAME, sessionToken, { secure: false });
                initialization.initializeLoggedInUser();
            }
        } else {
            initialization.initializeLoggedInUser();
        }
    }

    isLoggedIn() {
        return !_.isUndefined(this._principalStore.getPrincipal());
    }

    isAdmin() {
        return this._principalStore.isAdmin();
    }

    logout() {
        this._$cookies.remove(constants.SESSION_TOKEN_NAME);

        return this._sessionActionCreator.destroy()
            .then(() => this._websocketClient.disconnect())
            .then(() => this._loginNavigationActionCreator.login());
    }

    authorize(access) {
        switch (access) {
            case profiles.ADMIN:
                return this.isAdmin();
            case profiles.PRIVATE:
                return this.isLoggedIn();
            default:
                return !this.isLoggedIn();
        }
    }
}

export default AuthService;

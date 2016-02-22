import constants from 'constants';
import profiles from './profiles';

class AuthService {
    constructor($cookies, initialization, principalStore, sessionActionCreator, sessionStore) {
        'ngInject';

        this._$cookies = $cookies;
        this._initialization = initialization;
        this._principalStore = principalStore;
        this._sessionActionCreator = sessionActionCreator;
        this._sessionStore = sessionStore;

        this.checkCookie();
    }

    checkCookie() {
        let sessionToken = this._$cookies.get(constants.SESSION_TOKEN_NAME);

        if (_.isUndefined(sessionToken)) {
            sessionToken = this._sessionStore.getSessionToken();

            // TODO remove cookie and use token header in requests
            if (_.isUndefined(sessionToken)) {
                this._initialization.initialized = true;
            } else {
                this._$cookies.put(constants.SESSION_TOKEN_NAME, sessionToken, {
                    secure: false
                });

                this._userLogged();
            }
        } else {
            this._userLogged();
        }
    }

    _userLogged() {
        this._initialization.execute();
    }

    isLoggedIn() {
        return !_.isUndefined(this._principalStore.getPrincipal());
    }

    isAdmin() {
        return this._principalStore.isAdmin();
    }

    logout() {
        this._sessionActionCreator.destroy();
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

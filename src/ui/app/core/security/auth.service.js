import constants from 'constants';
import profiles from './profiles';

class AuthService {
    constructor($cookies, initialization, principalStore, sessionActionCreator, sessionStore) {
        'ngInject';
        let sessionToken = $cookies.get(constants.SESSION_TOKEN_NAME);

        this._principalStore = principalStore;
        this._sessionActionCreator = sessionActionCreator;
        this._sessionStore = sessionStore;

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
        return this._sessionActionCreator.destroy();
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

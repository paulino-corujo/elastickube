import profiles from './profiles';

const ELASTICKUBE_TOKEN = 'ElasticKube-Token';

class AuthService {
    constructor($rootScope, $cookies, routerHelper, session) {
        'ngInject';

        this._$rootScope = $rootScope;
        this._$cookies = $cookies;
        this._routerHelper = routerHelper;
        this._session = session;

        this.checkCookie();
    }

    get unauthorizedLoggedStateChange() {
        return this._unauthorizedLoggedStateChange || (() => {});
    }

    set unauthorizedLoggedStateChange(action) {
        this._unauthorizedLoggedStateChange = action;
    }

    get unauthorizedNotLoggedStateChange() {
        return this._unauthorizedNotLoggedStateChange || (() => {});
    }

    set unauthorizedNotLoggedStateChange(action) {
        this._unauthorizedNotLoggedStateChange = action;
    }

    checkCookie() {
        this._sessionCookie = this._$cookies.get(ELASTICKUBE_TOKEN);
        this._loggedIn = !!this._sessionCookie;

        if (this._loggedIn) {
            if (this._session.getItem(ELASTICKUBE_TOKEN) !== this._sessionCookie) {
                this._session.destroy();
                this._session.setItem(ELASTICKUBE_TOKEN, this._sessionCookie);
            }
        } else {
            this._sessionCookie = this._session.getItem(ELASTICKUBE_TOKEN);

            if (this._sessionCookie) {
                this._loggedIn = true;
                this._$cookies.put(ELASTICKUBE_TOKEN, this._sessionCookie, {
                    secure: false
                });
            }
        }

        this._$rootScope.$emit(`session.${this._loggedIn ? 'initialized' : 'destroyed'}`);
    }

    isLoggedIn() {
        return this._loggedIn;
    }

    isAdmin() {
        return false;
    }

    logout() {
        this._$cookies.remove(ELASTICKUBE_TOKEN);
        this._session.destroy();
        this._loggedIn = false;
        this._$rootScope.$emit('session.destroyed');
        this._routerHelper.changeToState('anonymous.login');
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

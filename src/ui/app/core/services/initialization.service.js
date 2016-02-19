import constants from 'constants';

class InitializationService {

    /* eslint max-params: 0 */
    constructor($q, $cookies, namespacesActionCreator, principalActionCreator, sessionActionCreator, sessionStore, usersActionCreator) {
        'ngInject';

        this._$q = $q;
        this._$cookies = $cookies;
        this._namespacesActionCreator = namespacesActionCreator;
        this._principalActionCreator = principalActionCreator;
        this._sessionActionCreator = sessionActionCreator;
        this._sessionStore = sessionStore;
        this._usersActionCreator = usersActionCreator;
    }

    execute() {
        const sessionToken = this._$cookies.get(constants.SESSION_TOKEN_NAME);
        const sessionDestroyed = sessionToken !== this._sessionStore.getSessionToken()
            ? this._sessionActionCreator.destroy().then(() => this._sessionActionCreator.storeSessionToken(sessionToken))
            : false;

        return this._$q.when(sessionDestroyed)
            .then(() => this._principalActionCreator.loggedIn())
            .then(() => this._$q.all([
                this._namespacesActionCreator.load(),
                this._usersActionCreator.load()
            ]));
    }
}

export default InitializationService;

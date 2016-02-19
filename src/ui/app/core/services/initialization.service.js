import constants from 'constants';

class InitializationService {

    /* eslint max-params: 0 */
    constructor($q, $cookies, namespacesActionCreator, namespacesStore, principalActionCreator, routerHelper, sessionActionCreator,
                sessionStore) {
        'ngInject';

        this._$q = $q;
        this._$cookies = $cookies;
        this._namespacesStore = namespacesStore;
        this._namespacesActionCreator = namespacesActionCreator;
        this._principalActionCreator = principalActionCreator;
        this._routerHelper = routerHelper;
        this._sessionActionCreator = sessionActionCreator;
        this._sessionStore = sessionStore;
    }

    execute() {
        const sessionToken = this._$cookies.get(constants.SESSION_TOKEN_NAME);
        const sessionDestroyed = sessionToken !== this._sessionStore.getSessionToken()
            ? this._sessionActionCreator.destroy().then(() => this._sessionActionCreator.storeSessionToken(sessionToken))
            : false;

        return this._$q.when(sessionDestroyed)
            .then(() => this._principalActionCreator.loggedIn())
            .then(() => this._namespacesActionCreator.load())
            .then(() => {
                let namespace = this._sessionStore.getActiveNamespace();

                if (_.isUndefined(namespace)) {
                    namespace = _.chain(this._namespacesStore.getAll())
                        .first()
                        .value();
                }
                return this._sessionActionCreator.selectNamespace(namespace)
                    .then(() => namespace);
            })
            .then((namespace) => this._routerHelper.changeToState(constants.pages.INSTANCES, { namespace }));
    }
}

export default InitializationService;

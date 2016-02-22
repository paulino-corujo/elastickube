import constants from 'constants';

class LoginService {
    constructor(initialization, routerHelper, sessionStore) {
        'ngInject';

        this._initialization = initialization;
        this._routerHelper = routerHelper;
        this._sessionStore = sessionStore;
    }

    execute() {
        return this._initialization.initializeLoggedInUser()
            .then(() => {
                const namespace = this._sessionStore.getActiveNamespace();

                return this._routerHelper.changeToState(constants.pages.INSTANCES, { namespace: namespace.metadata.name });
            });
    }
}

export default LoginService;

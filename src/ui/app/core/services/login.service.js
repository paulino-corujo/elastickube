import constants from 'constants';

class LoginService {
    constructor(routerHelper, sessionStore) {
        'ngInject';

        this._routerHelper = routerHelper;
        this._sessionStore = sessionStore;
    }

    execute() {
        const namespace = this._sessionStore.getActiveNamespace();

        return this._routerHelper.changeToState(constants.pages.INSTANCES, { namespace });
    }
}

export default LoginService;

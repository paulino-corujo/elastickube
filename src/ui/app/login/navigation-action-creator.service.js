class NavigationActionCreatorService {
    constructor(routerHelper, sessionStore) {
        'ngInject';

        this._routerHelper = routerHelper;
        this._sessionStore = sessionStore;
    }

    login() {
        return this._routerHelper.changeToState('login');
    }

    signup() {
        return this._routerHelper.changeToState('signup');
    }

    validateUser() {
        return this._routerHelper.changeToState('validate-user');
    }
}

export default NavigationActionCreatorService;

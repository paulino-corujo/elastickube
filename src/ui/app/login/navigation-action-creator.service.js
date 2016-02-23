class NavigationActionCreatorService {
    constructor(routerHelper, sessionStore) {
        'ngInject';

        this._routerHelper = routerHelper;
        this._sessionStore = sessionStore;
    }

    login() {
        return this._routerHelper.changeToState('anonymous.login');
    }

    signup() {
        return this._routerHelper.changeToState('anonymous.signup');
    }
}

export default NavigationActionCreatorService;

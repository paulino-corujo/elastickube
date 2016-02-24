class NavigationActionCreatorService {
    constructor(routerHelper, sessionStore) {
        'ngInject';

        this._routerHelper = routerHelper;
        this._sessionStore = sessionStore;
    }

    settings() {
        return this._routerHelper.changeToState('admin.settings');
    }

    users() {
        return this._routerHelper.changeToState('admin.users');
    }

    namespaces() {
        return this._routerHelper.changeToState('admin.namespaces');
    }

    charts() {
        return this._routerHelper.changeToState('admin.charts');
    }

    instances() {
        return this._routerHelper.changeToState('admin.instances');
    }
}

export default NavigationActionCreatorService;

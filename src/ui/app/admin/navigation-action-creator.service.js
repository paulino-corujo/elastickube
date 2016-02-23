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

    templates() {
        return this._routerHelper.changeToState('admin.templates');
    }

    instances() {
        return this._routerHelper.changeToState('admin.instances');
    }
}

export default NavigationActionCreatorService;

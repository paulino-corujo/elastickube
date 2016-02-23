class NavigationActionCreatorService {
    constructor(routerHelper, sessionStore) {
        'ngInject';

        this._routerHelper = routerHelper;
        this._sessionStore = sessionStore;
    }

    instances(namespace = this._sessionStore.getActiveNamespace()) {
        return this._routerHelper.changeToState('private.instances', { namespace: namespace.metadata.name });
    }
}

export default NavigationActionCreatorService;

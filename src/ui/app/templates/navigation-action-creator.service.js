class NavigationActionCreatorService {
    constructor(routerHelper, sessionStore) {
        'ngInject';

        this._routerHelper = routerHelper;
        this._sessionStore = sessionStore;
    }

    templates(namespace = this._sessionStore.getActiveNamespace()) {
        return this._routerHelper.changeToState('private.templates', { namespace: namespace.metadata.name });
    }
}

export default NavigationActionCreatorService;

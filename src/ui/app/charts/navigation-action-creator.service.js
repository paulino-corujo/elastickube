class NavigationActionCreatorService {
    constructor(routerHelper, sessionStore) {
        'ngInject';

        this._routerHelper = routerHelper;
        this._sessionStore = sessionStore;
    }

    charts(namespace = this._sessionStore.getActiveNamespace()) {
        return this._routerHelper.changeToState('charts', { namespace: namespace.metadata.name });
    }
}

export default NavigationActionCreatorService;

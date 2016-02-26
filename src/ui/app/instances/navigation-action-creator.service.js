class NavigationActionCreatorService {
    constructor(routerHelper, sessionStore) {
        'ngInject';

        this._routerHelper = routerHelper;
        this._sessionStore = sessionStore;
    }

    instance({ namespace, instanceId } = {}) {
        if (_.isUndefined(namespace)) {
            throw Error('namespace parameter is mandatory');
        }

        if (_.isUndefined(instanceId)) {
            throw Error('instanceId parameter is mandatory');
        }

        return this._routerHelper.changeToState('instance', { namespace, instanceId });
    }

    instances(namespace = this._sessionStore.getActiveNamespace()) {
        return this._routerHelper.changeToState('instances', { namespace: namespace.metadata.name });
    }

    newInstance() {
        return this._routerHelper.changeToState('new-instance');
    }
}

export default NavigationActionCreatorService;

class CheckNamespaceService {
    constructor($stateParams, instancesNavigationActionCreator, namespacesStore, sessionActionCreator, sessionStore) {
        'ngInject';

        this._$stateParams = $stateParams;
        this._instancesNavigationActionCreator = instancesNavigationActionCreator;
        this._namespacesStore = namespacesStore;
        this._sessionActionCreator = sessionActionCreator;
        this._sessionStore = sessionStore;
    }

    execute() {
        let namespace = this._$stateParams.namespace;

        if (!_.isUndefined(namespace)) {
            namespace = _.find(this._namespacesStore.getAll(), _.matchesProperty('metadata.name', namespace));

            if (_.isUndefined(namespace)) {
                return this._instancesNavigationActionCreator.instances();
            } else if (namespace !== this._sessionStore.getActiveNamespace()) {
                return this._sessionActionCreator.selectNamespace(namespace);
            }
        }
    }
}

export default CheckNamespaceService;

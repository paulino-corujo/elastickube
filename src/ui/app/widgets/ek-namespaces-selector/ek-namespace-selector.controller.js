class NamespacesSelectorController {

    constructor($scope, $state, instancesNavigationActionCreator, chartsNavigationActionCreator, sessionStore, namespacesStore,
                sessionActionCreator) {
        'ngInject';

        const onChange = () => {
            this.namespaces = this._namespacesStoreService.getAll();
            this.namespace = _.find(this.namespaces, _.matchesProperty('metadata.uid', this.namespace.metadata.uid)) || this.namespaces[0];
        };
        const onNamespaceChange = () => this.namespace = this._sessionStoreService.getActiveNamespace();

        this._$state = $state;
        this._instancesNavigationActionCreator = instancesNavigationActionCreator;
        this._chartsNavigationActionCreator = chartsNavigationActionCreator;
        this._namespacesStoreService = namespacesStore;
        this._sessionStoreService = sessionStore;
        this._sessionActionCreator = sessionActionCreator;

        this._sessionStoreService.addNamespaceChangeListener(onNamespaceChange);
        this._namespacesStoreService.addChangeListener(onChange);

        this.namespaces = this._namespacesStoreService.getAll();
        this.namespace = this._sessionStoreService.getActiveNamespace();

        $scope.$on('$destroy', () => {
            this._namespacesStoreService.removeChangeListener(onChange);
            this._sessionStoreService.removeNamespaceChangeListener(onNamespaceChange);
        });
    }

    namespaceSelected() {
        return this._sessionActionCreator.selectNamespace(this.namespace)
            .then(() => {
                switch (this._$state.current.name) {
                    case 'private.instances':
                        return this._instancesNavigationActionCreator.instances();

                    case 'private.charts':
                        return this._chartsNavigationActionCreator.charts();

                    default:
                }
            });
    }
}

export default NamespacesSelectorController;

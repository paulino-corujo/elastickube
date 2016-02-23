class NamespacesSelectorController {

    constructor($scope, $state, instancesNavigationActionCreator, templatesNavigationActionCreator, sessionStore, namespacesStore,
                sessionActionCreator) {
        'ngInject';

        const onChange = () => this.namespaces = this._namespacesStoreService.getAll();
        const onNamespaceChange = () => this.namespace = this._sessionStoreService.getActiveNamespace();

        this._$state = $state;
        this._instancesNavigationActionCreator = instancesNavigationActionCreator;
        this._templatesNavigationActionCreator = templatesNavigationActionCreator;
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

                    case 'private.templates':
                        return this._templatesNavigationActionCreator.templates();

                    default:
                }
            });
    }
}

export default NamespacesSelectorController;

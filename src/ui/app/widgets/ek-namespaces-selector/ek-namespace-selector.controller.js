class NamespacesSelectorController {

    constructor($scope, sessionStore, namespacesStore, sessionActionCreator) {
        'ngInject';

        const onChange = () => this.namespaces = this._namespacesStoreService.getAll();
        const onNamespaceChange = () => this.namespace = this._sessionStoreService.getActiveNamespace();

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
        this._sessionActionCreator.selectNamespace(this.namespace);
    }
}

export default NamespacesSelectorController;

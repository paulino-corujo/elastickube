class NamespacesSelectorController {

    constructor($scope, sessionStore, namespacesStore, uiActionCreator) {
        'ngInject';

        const onChange = () => this._loadState();
        const onNamespaceChange = () => this.namespace = this._sessionStoreService.getActiveNamespace();

        this._namespacesStoreService = namespacesStore;
        this._sessionStoreService = sessionStore;
        this._uiActionCreatorService = uiActionCreator;
        this._sessionStoreService.addNamespaceChangeListener(onNamespaceChange);
        this._namespacesStoreService.addChangeListener(onChange);

        this._loadState();

        $scope.$on('$destroy', () => {
            this._namespacesStoreService.removeChangeListener(onChange);
            this._sessionStoreService.removeNamespaceChangeListener(onNamespaceChange);
        });
    }

    _loadState() {
        this.namespaces = this._namespacesStoreService.getAll();
        this.namespace = this._sessionStoreService.getActiveNamespace();
    }

    namespaceSelected() {
        this._uiActionCreatorService.namespaceSelected(this.namespace);
    }
}

export default NamespacesSelectorController;

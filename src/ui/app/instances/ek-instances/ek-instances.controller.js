class InstancesController {
    constructor($scope, instancesNavigationActionCreator, instancesStore, sessionStore) {
        'ngInject';

        const onChange = () => this.instances = this._instancesStore.getAll(sessionStore.getActiveNamespace().metadata.name);
        const removeInstancesListener = () => this._instancesStore.removeChangeListener(onChange);

        this._instancesNavigationActionCreator = instancesNavigationActionCreator;
        this._instancesStore = instancesStore;
        this._instancesStore.addChangeListener(onChange);
        sessionStore.addNamespaceChangeListener(removeInstancesListener);

        this.instances = this._instancesStore.getAll(sessionStore.getActiveNamespace().metadata.name);
        this.selectedView = 'list';
        this.showEmpty = true;
        this.instancesFilteredByOwnerAndStatus = [];
        this.instancesFilteredBySearch = [];

        $scope.$watchCollection('ctrl.instancesFilteredBySearch', (x) => this.showEmpty = _.isEmpty(x));

        $scope.$on('$destroy', () => {
            removeInstancesListener();
            sessionStore.removeNamespaceChangeListener(removeInstancesListener);
        });
    }

    selectView(name) {
        this.selectedView = name;
    }

    newInstance() {
        this._instancesNavigationActionCreator.newInstance();
    }
}

export default InstancesController;

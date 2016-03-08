class InstancesController {
    constructor($scope, instancesNavigationActionCreator, instancesStore, sessionStore) {
        'ngInject';

        const onChange = () => this.instances = instancesStore.getAll(sessionStore.getActiveNamespace().metadata.name);
        const removeInstancesListener = () => instancesStore.removeChangeListener(onChange);

        this._instancesNavigationActionCreator = instancesNavigationActionCreator;

        instancesStore.addChangeListener(onChange);
        sessionStore.addNamespaceChangeListener(removeInstancesListener);

        this.instances = instancesStore.getAll(sessionStore.getActiveNamespace().metadata.name);
        this.selectedInstances = [];
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

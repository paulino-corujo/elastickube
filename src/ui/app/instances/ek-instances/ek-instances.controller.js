class InstancesController {
    constructor($scope, instancesNavigationActionCreator, instancesStore) {
        'ngInject';

        const onChange = () => this.instances = this._instancesStore.getAll();

        this._instancesNavigationActionCreator = instancesNavigationActionCreator;
        this._instancesStore = instancesStore;
        this._instancesStore.addChangeListener(onChange);

        this.instances = this._instancesStore.getAll();
        this.selectedView = 'list';
        this.showEmpty = true;
        this.instancesFilteredByOwnerAndStatus = [];
        this.instancesFilteredBySearch = [];

        $scope.$watchCollection('ctrl.instancesFilteredBySearch', (x) => this.showEmpty = _.isEmpty(x));

        $scope.$on('$destroy', () => this._instancesStore.removeChangeListener(onChange));
    }

    selectView(name) {
        this.selectedView = name;
    }

    newInstance() {
        this._instancesNavigationActionCreator.newInstance();
    }
}

export default InstancesController;

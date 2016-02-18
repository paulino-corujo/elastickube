class InstancesController {
    constructor($scope, instancesStore) {
        'ngInject';

        const onChange = () => this.instances = this._instancesStore.getAll();

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
}

export default InstancesController;

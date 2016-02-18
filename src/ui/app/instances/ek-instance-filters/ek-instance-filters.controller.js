class InstanceFiltersController {
    constructor($scope) {
        'ngInject';

        this.instancesFilteredByState = [];
        this.selectedState = 'all';
        this.selectedOwners = [];
        this.filteredInstances = [];

        $scope.$watch('ctrl.selectedState', () => this.filterInstancesByState());
        $scope.$watchCollection('ctrl.instancesToFilter', () => this.filterInstancesByState());

        $scope.$watchCollection('ctrl.selectedOwners', () => this.filterInstancesByOwners());
        $scope.$watchCollection('ctrl.instancesFilteredByState', () => this.filterInstancesByOwners());
    }

    filterInstancesByState() {
        this.instancesFilteredByState = _.chain(this.instancesToFilter)
            .filter((x) => this.selectedState === 'all' || this.selectedState === x.state)
            .value();
    }

    filterInstancesByOwners() {
        this.filteredInstances = _.isEmpty(this.selectedOwners)
            ? this.instancesFilteredByState
            : _.filter(this.instancesFilteredByState, (x) => _.includes(this.selectedOwners, x.owner));
    }
}

export default InstanceFiltersController;

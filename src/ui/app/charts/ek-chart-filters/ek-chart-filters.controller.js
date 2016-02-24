class ChartFiltersController {
    constructor($scope) {
        'ngInject';

        this.chartsFilteredByType = [];
        this.selectedType = 'all';
        this.selectedOwners = [];
        this.filteredCharts = [];

        $scope.$watch('ctrl.selectedType', () => this.filterByType());
        $scope.$watchCollection('ctrl.chartsToFilter', () => this.filterByType());

        $scope.$watchCollection('ctrl.chartsFilteredByType', () => this.filterByOwner());
        $scope.$watchCollection('ctrl.selectedOwners', () => this.filterByOwner());
    }

    filterByType() {
        this.chartsFilteredByType = _.chain(this.chartsToFilter)
            .filter((x) => this.selectedType === 'all' || this.selectedType === x.type)
            .value();
    }

    filterByOwner() {
        this.filteredCharts = _.isEmpty(this.selectedOwners)
            ? this.chartsFilteredByType
            : _.filter(this.chartsFilteredByType, (x) => _.includes(this.selectedOwners, x.owner));
    }
}

export default ChartFiltersController;

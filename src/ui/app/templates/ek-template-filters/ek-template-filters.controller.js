class TemplateFiltersController {
    constructor($scope) {
        'ngInject';

        this.templatesFilteredByType = [];
        this.selectedType = 'all';
        this.selectedOwners = [];
        this.filteredTemplates = [];

        $scope.$watch('ctrl.selectedType', () => this.filterByType());
        $scope.$watchCollection('ctrl.templatesToFilter', () => this.filterByType());

        $scope.$watchCollection('ctrl.templatesFilteredByType', () => this.filterByOwner());
        $scope.$watchCollection('ctrl.selectedOwners', () => this.filterByOwner());
    }

    filterByType() {
        this.templatesFilteredByType = _.chain(this.templatesToFilter)
            .filter((x) => this.selectedType === 'all' || this.selectedType === x.type)
            .value();
    }

    filterByOwner() {
        this.filteredTemplates = _.isEmpty(this.selectedOwners)
            ? this.templatesFilteredByType
            : _.filter(this.templatesFilteredByType, (x) => _.includes(this.selectedOwners, x.owner));
    }
}

export default TemplateFiltersController;

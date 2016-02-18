import mockTemplates from 'mocks/templates';

class TemplatesController {
    constructor($scope) {
        'ngInject';

        this.templates = mockTemplates;
        this.templatesFilteredByOwnerAndType = [];
        this.templatesFilteredBySearch = [];
        this.templatesSortedByType = [];
        this.selectedView = 'list';
        this.showEmpty = true;

        $scope.$watch('ctrl.templatesFilteredBySearch', () => this.checkIsEmpty());
        $scope.$watch('ctrl.templatesSortedByType', () => this.checkIsEmpty());
    }

    checkIsEmpty() {
        this.showEmpty = this.selectedView === 'list'
            ? _.isEmpty(this.templatesFilteredBySearch)
            : _.isEmpty(this.templatesSortedByType);
    }

    selectView(name) {
        this.selectedView = name;
        this.checkIsEmpty();
    }
}

export default TemplatesController;

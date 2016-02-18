import headers from './ek-template-list.headers';

class TemplateListController {
    constructor($scope) {
        'ngInject';

        this.headers = headers;
        this.sortBy = this.headers[0];

        $scope.$watchCollection('ctrl.templates', (x) => this.sortedTemplates = sortTemplates(x, this.sortBy));
    }

    sortByCallback(column, sortOrder) {
        this.sortedTemplates = sortTemplates(this.sortedTemplates, column, sortOrder);
    }
}

function sortTemplates(templates, column, sortOrder) {
    if (!_.isUndefined(column.sortableField)) {
        return _.orderBy(templates, (x) => _.get(x, column.sortableField), sortOrder);
    }

    return templates;
}

export default TemplateListController;

import headers from './ek-instance-list.headers';

class InstanceListController {
    constructor($scope) {
        'ngInject';

        this.headers = headers;
        this.sortBy = this.headers[0];

        $scope.$watchCollection('ctrl.instances', (x) => this.sortedInstances = sortInstances(x, this.sortBy));
    }

    sortByCallback(column, sortOrder) {
        this.sortedInstances = sortInstances(this.sortedInstances, column, sortOrder);
    }
}

function sortInstances(instances, column, sortOrder) {
    if (angular.isDefined(column.sortableField)) {
        return _.orderBy(instances, (x) => _.get(x, column.sortableField), sortOrder);
    }

    return instances;
}

export default InstanceListController;

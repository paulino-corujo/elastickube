class ChartSorterController {
    constructor($scope, usersStore) {
        'ngInject';

        this._userStoreService = usersStore;

        this.sortTypes = ['name', 'most recent', 'owner'];
        this.sortType = _.first(this.sortTypes);

        $scope.$watch('ctrl.sortType', (x) => this.sortedCollection = sortByType(this.collectionToSort, x));
        $scope.$watchCollection('ctrl.collectionToSort', (x) => this.sortedCollection = sortByType(x, this.sortType));
    }
}

function sortByType(collectionToSort, sortType) {
    switch (sortType) {
        case 'name':
            return sortByName(collectionToSort);
        case 'owner':
            return sortByOwner(collectionToSort);
        default:
            return sortByMostRecent(collectionToSort);
    }
}

function sortByName(collectionToSort) {
    return _.orderBy(collectionToSort, 'name');
}

function sortByMostRecent(collectionToSort) {
    return _.orderBy(collectionToSort, 'created');
}

function sortByOwner(collectionToSort) {
    return _.sortBy(collectionToSort, (x) => _.find(this._userStoreService.getAll(), { id: x.owner }).name);
}

export default ChartSorterController;

class SearchFilterController {
    constructor($scope) {
        'ngInject';

        this.text = '';

        $scope.$watchCollection('ctrl.collectionToBeFiltered', () => this.search());
    }

    search() {
        this.filteredCollection = _.size(this.text.trim()) > 0
            ? this._filter(this.collectionToBeFiltered, this.text)
            : this.collectionToBeFiltered;
    }

    _filter(collectionToBeFiltered, text) {
        return _.filter(collectionToBeFiltered, (x) => _.get(x, this.searchField).toLowerCase().indexOf(text.toLowerCase()) !== -1);
    }
}

export default SearchFilterController;

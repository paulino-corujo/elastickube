class SearchFilterController {
    constructor($scope) {
        'ngInject';

        this.text = '';

        $scope.$watchCollection('ctrl.collectionToBeFiltered', () => this.search());
    }

    search() {
        this.filteredCollection = _.size(this.text.trim()) > 0
            ? filter(this.collectionToBeFiltered, this.text)
            : this.collectionToBeFiltered;
    }
}

function filter(collectionToBeFiltered, text) {
    return _.filter(collectionToBeFiltered, (x) => x.name.toLowerCase().indexOf(text.toLowerCase()) !== -1);
}

export default SearchFilterController;

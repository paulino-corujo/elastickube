class ChartsController {
    constructor($scope, chartsStore) {
        'ngInject';

        const onChange = () => this.charts = this._chartsStore.getAll();

        this._chartsStore = chartsStore;
        this._chartsStore.addChangeListener(onChange);

        this.charts = this._chartsStore.getAll();
        this.chartsFilteredByOwnerAndType = [];
        this.chartsFilteredBySearch = [];
        this.chartsSortedByType = [];
        this.selectedView = 'list';
        this.showEmpty = true;

        $scope.$watch('ctrl.chartsFilteredBySearch', () => this.checkIsEmpty());
        $scope.$watch('ctrl.chartsSortedByType', () => this.checkIsEmpty());

        $scope.$on('$destroy', () => this._chartsStore.removeChangeListener(onChange));
    }

    checkIsEmpty() {
        this.showEmpty = this.selectedView === 'list'
            ? _.isEmpty(this.chartsFilteredBySearch)
            : _.isEmpty(this.chartsSortedByType);
    }

    selectView(name) {
        this.selectedView = name;
        this.checkIsEmpty();
    }
}

export default ChartsController;

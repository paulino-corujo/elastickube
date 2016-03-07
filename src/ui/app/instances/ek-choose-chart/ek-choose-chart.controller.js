const NEW_INSTANCE_STEP = 1;

class ChooseChartController {
    constructor($scope, $element, $stateParams, chartsStore) {
        'ngInject';

        this._$element = $element;
        this._$stateParams = $stateParams;

        this._chartStoreService = chartsStore;
        this.charts = _.orderBy(this._chartStoreService.getAll(), 'name');

        if (_.isFunction(this.onSelection())) {
            this.onSelection = this.onSelection();
        }

        $scope.$watch('ctrl.step', (step) => {
            if (step === NEW_INSTANCE_STEP) {
                this._$element.addClass('ek-choose-chart--active');
            } else {
                this._$element.removeClass('ek-choose-chart--active');
            }
        });

        if (this._$stateParams.chart) {
            this.selectedChart = _.find(this.charts, this._$stateParams.chart);
            this.chartSelected();
        }
    }

    editChart() {
        this.parentController.editChart();
    }

    chartNotSelected() {
        return _.isUndefined(this.selectedChart);
    }

    chartSelected() {
        this.onSelection(this.selectedChart);
    }

    selectChart() {
        return (chart) => this.selectedChart = chart;
    }
}

export default ChooseChartController;

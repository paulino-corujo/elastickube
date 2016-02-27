const NEW_INSTANCE_STEP = 1;

class ChooseChartController {
    constructor($scope, $element, chartsStore) {
        'ngInject';

        this._$element = $element;
        this._chartStoreService = chartsStore;
        this.charts = this._chartStoreService.getAll();

        $scope.$watch('ctrl.step', (step) => {
            if (step === NEW_INSTANCE_STEP) {
                this._$element.addClass('ek-choose-chart--active');
            } else {
                this._$element.removeClass('ek-choose-chart--active');
            }
        });
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

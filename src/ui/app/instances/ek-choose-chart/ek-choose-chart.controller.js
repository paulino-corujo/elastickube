/*
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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

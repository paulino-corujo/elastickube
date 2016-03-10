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
        this.showEmpty = _.isEmpty(this.chartsSortedByType);
    }
}

export default ChartsController;

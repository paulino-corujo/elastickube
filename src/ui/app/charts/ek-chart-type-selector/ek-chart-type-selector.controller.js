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

const types = [
    'all'
];

class ChartTypeSelectorController {
    constructor($scope) {
        'ngInject';

        this.types = types;
        this.selectedType = _.first(this.types);

        $scope.$watchCollection('ctrl.charts', (x) => this.typeValues = countTypes(x));
    }

    selectType(state) {
        this.selectedType = state;
    }
}

function countTypes(charts) {
    return _.chain(charts)
        .groupBy('type')
        .mapValues((x) => x.length)
        .value();
}

export default ChartTypeSelectorController;

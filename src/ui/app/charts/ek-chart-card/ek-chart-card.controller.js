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

class ChartController {
    constructor($filter, chartsNavigationActionCreator) {
        'ngInject';

        const date = $filter('ekHumanizeDate')(this.chart.committed_date, 'epoch');

        this._chartsNavigationActionCreator = chartsNavigationActionCreator;
        this.description = `${this.chart.maintainers[0].split('<')[0]} · ${date} ago`;
    }

    deploy() {
        this._chartsNavigationActionCreator.deployChart(this.chart);
    }
}

export default ChartController;

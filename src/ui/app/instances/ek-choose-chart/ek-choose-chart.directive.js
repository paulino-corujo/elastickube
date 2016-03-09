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

import './ek-choose-chart.less';
import Directive from 'directive';
import constants from '../constants';
import Controller from './ek-choose-chart.controller';
import template from './ek-choose-chart.html';

class ChooseChartDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.require = ['ekChooseChart', '^ekNewInstance'];
        this.bindToController = {
            step: '=',
            onSelection: '&'
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-choose-chart')
            .attr('layout', 'column');

        return ($scope, $element, attrs, ctrls) => {
            const [chooseTemplateCtrl, newInstanceCtrl] = ctrls;

            chooseTemplateCtrl.parentController = newInstanceCtrl;

            _.extend($scope, constants);
        };
    }
}

export default ChooseChartDirective;

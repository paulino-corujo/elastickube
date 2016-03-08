import './ek-chart-card.less';
import Directive from 'directive';
import Controller from './ek-chart-card.controller';
import constants from '../constants';
import template from './ek-chart-card.html';

class ChartCardDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            chart: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-chart-card')
            .attr('layout', 'column');

        return ($scope) => _.extend($scope, constants);
    }
}

export default ChartCardDirective;

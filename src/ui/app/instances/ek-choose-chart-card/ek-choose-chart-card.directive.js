import './ek-choose-chart-card.less';
import constants from '../../widgets/constants';
import Directive from 'directive';
import Controller from './ek-choose-chart-card.controller';
import template from './ek-choose-chart-card.html';

class ChartCardDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            chart: '=',
            selected: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-choose-chart-card')
            .attr('layout', 'column');

        return ($scope) => _.extend($scope, constants);
    }
}

export default ChartCardDirective;

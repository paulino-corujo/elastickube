import './ek-donut-chart.less';
import Directive from 'directive';
import Controller from './ek-donut-chart.controller';

class DonutChartDirective extends Directive {
    constructor() {
        super({ Controller });

        this.bindToController = {
            dataset: '=',
            chartId: '@',
            marginBetweenCircles: '=',
            strokeWidth: '='

        };
    }

    link($scope, $element) {
        $element.addClass(`ek-donut-chart ek-donut-chart--${$scope.ctrl.chartId}`);
    }
}

export default DonutChartDirective;

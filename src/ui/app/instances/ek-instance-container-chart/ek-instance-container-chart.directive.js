import './ek-instance-container-chart.less';
import Directive from 'directive';
import Controller from './ek-instance-container-chart.controller';
import template from './ek-instance-container-chart.html';

class InstanceContainerChartDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            container: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-instance-container-chart');
    }
}

export default InstanceContainerChartDirective;

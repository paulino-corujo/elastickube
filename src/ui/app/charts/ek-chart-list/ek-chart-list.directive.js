import './ek-chart-list.less';
import Directive from 'directive';
import Controller from './ek-chart-list.controller';
import template from './ek-chart-list.html';

class ChartListDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            charts: '=?'
        };
    }

    compile(tElement) {
        tElement.addClass('ek-chart-list');
    }
}

export default ChartListDirective;

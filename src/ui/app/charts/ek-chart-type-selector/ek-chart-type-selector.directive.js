import './ek-chart-type-selector.less';
import Directive from 'directive';
import Controller from './ek-chart-type-selector.controller';
import template from './ek-chart-type-selector.html';

class ChartTypeSelectorDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            charts: '=',
            selectedType: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-chart-type-selector')
            .attr('layout', 'column');
    }
}

export default ChartTypeSelectorDirective;

import './ek-choose-chart-card.less';
import Directive from 'directive';
import template from './ek-choose-chart-card.html';

class ChartCardDirective extends Directive {
    constructor() {
        super({ template });

        this.scope = {
            chart: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-choose-chart-card')
            .attr('layout', 'column');
    }
}

export default ChartCardDirective;

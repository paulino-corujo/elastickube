import './ek-chart-grid.less';
import Directive from 'directive';
import template from './ek-chart-grid.html';

class ChartGridDirective extends Directive {
    constructor() {
        super({ template });

        this.scope = {
            charts: '=?'
        };
    }

    compile(tElement) {
        tElement.addClass('ek-chart-grid');
    }
}

export default ChartGridDirective;

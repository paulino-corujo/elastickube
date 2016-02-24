import './ek-chart-filters.less';

import Directive from 'directive';
import Controller from './ek-chart-filters.controller';
import template from './ek-chart-filters.html';

class ChartFiltersDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            chartsToFilter: '=',
            filteredCharts: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-template-filters')
            .attr('layout', 'column');
    }
}

export default ChartFiltersDirective;

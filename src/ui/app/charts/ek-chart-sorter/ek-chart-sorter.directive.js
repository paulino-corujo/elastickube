import './ek-chart-sorter.less';
import Directive from 'directive';
import Controller from './ek-chart-sorter.controller';
import template from './ek-chart-sorter.html';

class ChartSorterDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            collectionToSort: '=',
            sortedCollection: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-chart-sorter');
    }
}

export default ChartSorterDirective;

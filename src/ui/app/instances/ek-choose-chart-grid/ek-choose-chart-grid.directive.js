import './ek-choose-chart-grid.less';
import Directive from 'directive';
import Controller from './ek-choose-chart-grid.controller';
import template from './ek-choose-chart-grid.html';

class ChooseChartGridDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            charts: '=?',
            onSelection: '&',
            selectedChart: '=?'
        };
    }

    compile(tElement) {
        tElement.addClass('ek-choose-chart-grid');
        return ($scope, $element, attrs, ctrl) => {
            if (_.isFunction(ctrl.onSelection())) {
               ctrl.onSelection = ctrl.onSelection();
            }
        };
    }
}

export default ChooseChartGridDirective;

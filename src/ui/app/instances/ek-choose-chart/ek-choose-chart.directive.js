import './ek-choose-chart.less';
import Directive from 'directive';
import constants from '../constants';
import Controller from './ek-choose-chart.controller';
import template from './ek-choose-chart.html';

class ChooseChartDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.require = ['ekChooseChart', '^ekNewInstance'];
        this.bindToController = {
            step: '=',
            onSelection: '&'
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-choose-chart')
            .attr('layout', 'column');

        return ($scope, $element, attrs, ctrls) => {
            const [chooseTemplateCtrl, newInstanceCtrl] = ctrls;

            chooseTemplateCtrl.parentController = newInstanceCtrl;
            _.extend($scope, constants);
            if (_.isFunction(chooseTemplateCtrl.onSelection())) {
                chooseTemplateCtrl.onSelection = chooseTemplateCtrl.onSelection();
            }
        };
    }
}

export default ChooseChartDirective;

import './ek-charts.less';
import Directive from 'directive';
import constants from '../constants';
import Controller from './ek-charts.controller';
import template from './ek-charts.html';

class ChartsDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            instance: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-charts')
            .attr('layout', 'column');

        return ($scope) => _.extend($scope, constants);
    }
}

export default ChartsDirective;

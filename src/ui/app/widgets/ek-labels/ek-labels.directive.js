import './ek-labels.less';
import Directive from 'directive';
import constants from '../constants';
import template from './ek-labels.html';
import Controller from './ek-labels.controller';

class InstanceLabelsDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            labels: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-labels');

        return ($scope) => _.extend($scope, constants);
    }
}

export default InstanceLabelsDirective;

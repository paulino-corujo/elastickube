import './ek-instance-labels.less';
import Directive from 'directive';
import constants from '../constants';
import template from './ek-instance-labels.html';
import Controller from './ek-instance-labels.controller';

class InstanceLabelsDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            instance: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-instance-labels');

        return ($scope) => _.extend($scope, constants);
    }
}

export default InstanceLabelsDirective;

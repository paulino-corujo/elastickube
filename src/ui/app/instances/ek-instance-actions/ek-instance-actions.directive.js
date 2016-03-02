import './ek-instance-actions.less';
import Directive from 'directive';
import constants from '../constants';
import Controller from './ek-instance-actions.controller';
import template from './ek-instance-actions.html';

class InstanceActionsDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            instance: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-instance-actions');

        return ($scope) => _.extend($scope, constants);
    }
}

export default InstanceActionsDirective;

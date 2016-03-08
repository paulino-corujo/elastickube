import './ek-instance-bulk-actions.less';
import Directive from 'directive';
import constants from '../constants';
import Controller from './ek-instance-bulk-actions.controller';
import template from './ek-instance-bulk-actions.html';

class InstanceBulkActionsDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            instances: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-instance-bulk-actions');

        return ($scope) => _.extend($scope, constants);
    }
}

export default InstanceBulkActionsDirective;

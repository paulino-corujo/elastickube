import './ek-instances.less';
import Directive from 'directive';
import Controller from './ek-instances.controller';
import constants from '../constants';
import template from './ek-instances.html';

class InstancesDirective extends Directive {
    constructor() {
        super({ Controller, template });
    }

    compile(tElement) {
        tElement
            .addClass('ek-instances')
            .attr('layout', 'column');

        return ($scope) => _.extend($scope, constants);
    }
}

export default InstancesDirective;

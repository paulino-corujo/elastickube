import './ek-instance-list.less';
import Directive from 'directive';
import Controller from './ek-instance-list.controller';
import template from './ek-instance-list.html';

class InstanceListDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            instances: '=?'
        };
    }

    compile(tElement) {
        tElement.addClass('ek-instance-list');
    }
}

export default InstanceListDirective;

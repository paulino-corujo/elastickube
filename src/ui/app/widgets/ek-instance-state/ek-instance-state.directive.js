import './ek-instance-state.less';
import Directive from 'directive';
import Controller from './ek-instance-state.controller';
import template from './ek-instance-state.html';

class InstanceStateDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            instance: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-instance-state');
    }
}

export default InstanceStateDirective;

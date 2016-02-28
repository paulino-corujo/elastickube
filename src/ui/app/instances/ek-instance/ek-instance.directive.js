import './ek-instance.less';
import Directive from 'directive';
import Controller from './ek-instance.controller';
import template from './ek-instance.html';

class InstanceDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            instance: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-instance');
    }
}

export default InstanceDirective;

import './ek-instance-modified.less';
import Directive from 'directive';
import Controller from './ek-instance-modified.controller';
import template from './ek-instance-modified.html';

class InstanceModifiedDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            instance: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-instance-modified');
    }
}

export default InstanceModifiedDirective;

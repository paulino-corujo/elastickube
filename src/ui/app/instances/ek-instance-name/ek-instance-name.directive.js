import './ek-instance-name.less';
import Directive from 'directive';
import template from './ek-instance-name.html';

class InstanceNameDirective extends Directive {
    constructor() {
        super({ template });

        this.scope = {
            instance: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-instance-name');
    }
}

export default InstanceNameDirective;

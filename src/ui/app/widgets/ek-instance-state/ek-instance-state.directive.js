import './ek-instance-state.less';
import Directive from 'directive';
import template from './ek-instance-state.html';

class InstanceStateDirective extends Directive {
    constructor() {
        super({ template });

        this.scope = {
            instance: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-instance-state');
    }
}

export default InstanceStateDirective;

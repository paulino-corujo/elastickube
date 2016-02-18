import './ek-instance-state-selector.less';
import Directive from 'directive';
import Controller from './ek-instance-state-selector.controller';
import template from './ek-instance-state-selector.html';

class InstanceStateSelectorDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            instances: '=',
            selectedState: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-instance-state-selector')
            .attr('layout', 'column');
    }
}

export default InstanceStateSelectorDirective;

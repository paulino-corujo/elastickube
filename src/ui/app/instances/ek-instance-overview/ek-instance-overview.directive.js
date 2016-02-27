import './ek-instance-overview.less';
import Directive from 'directive';
import Controller from './ek-instance-overview.controller';
import template from './ek-instance-overview.html';

class InstanceOverviewDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            instance: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-instance-overview');
    }
}

export default InstanceOverviewDirective;

import './ek-instance-overview-details.less';
import Directive from 'directive';
import Controller from './ek-instance-overview-details.controller';
import template from './ek-instance-overview-details.html';

class InstanceOverviewDetailsDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            instance: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-instance-overview-details ek-white-box');
    }
}

export default InstanceOverviewDetailsDirective;

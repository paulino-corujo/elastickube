import './ek-instance-overview-events.less';
import Directive from 'directive';
import Controller from './ek-instance-overview-events.controller';
import template from './ek-instance-overview-events.html';

class InstanceOverviewEventsDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            instance: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-instance-overview-events ek-white-box');
    }
}

export default InstanceOverviewEventsDirective;

import './ek-instance-overview-labels.less';
import Directive from 'directive';
import Controller from './ek-instance-overview-labels.controller';
import template from './ek-instance-overview-labels.html';

class InstanceOverviewLabelsDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            instance: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-instance-overview-labels ek-white-box');
    }
}

export default InstanceOverviewLabelsDirective;

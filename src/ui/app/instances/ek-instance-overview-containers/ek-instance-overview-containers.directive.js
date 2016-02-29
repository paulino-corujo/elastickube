import './ek-instance-overview-containers.less';
import Directive from 'directive';
import Controller from './ek-instance-overview-containers.controller';
import template from './ek-instance-overview-containers.html';

class InstanceOverviewContainersDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            instance: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-instance-overview-containers ek-white-box');
    }
}

export default InstanceOverviewContainersDirective;

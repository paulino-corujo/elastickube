import './ek-instance-filters.less';
import Directive from 'directive';
import Controller from './ek-instance-filters.controller';
import template from './ek-instance-filters.html';

class InstanceFiltersDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            instancesToFilter: '=',
            filteredInstances: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-instance-filters')
            .attr('layout', 'column');
    }
}

export default InstanceFiltersDirective;

import './ek-template-filters.less';

import Directive from 'directive';
import Controller from './ek-template-filters.controller';
import template from './ek-template-filters.html';

class TemplateFiltersDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            templatesToFilter: '=',
            filteredTemplates: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-template-filters')
            .attr('layout', 'column');
    }
}

export default TemplateFiltersDirective;

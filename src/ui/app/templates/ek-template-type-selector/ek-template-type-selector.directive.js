import './ek-template-type-selector.less';
import Directive from 'directive';
import Controller from './ek-template-type-selector.controller';
import template from './ek-template-type-selector.html';

class TemplateTypeSelectorDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            templates: '=',
            selectedType: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-template-type-selector')
            .attr('layout', 'column');
    }
}

export default TemplateTypeSelectorDirective;

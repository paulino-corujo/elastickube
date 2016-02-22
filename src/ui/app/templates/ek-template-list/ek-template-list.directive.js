import './ek-template-list.less';
import Directive from 'directive';
import Controller from './ek-template-list.controller';
import template from './ek-template-list.html';

class TemplateListDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            templates: '=?'
        };
    }

    compile(tElement) {
        tElement.addClass('ek-template-list');
    }
}

export default TemplateListDirective;

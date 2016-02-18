import './ek-template-card.less';
import Directive from 'directive';
import Controller from './ek-template-card.controller';
import template from './ek-template-card.html';

class TemplateCardDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            template: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-template-card')
            .attr('layout', 'column');
    }
}

export default TemplateCardDirective;

import './ek-template-grid.less';
import Directive from 'directive';
import template from './ek-template-grid.html';

class TemplateGridDirective extends Directive {
    constructor() {
        super({ template });

        this.scope = {
            templates: '=?'
        };
    }

    compile(tElement) {
        tElement.addClass('ek-template-grid');
    }
}

export default TemplateGridDirective;

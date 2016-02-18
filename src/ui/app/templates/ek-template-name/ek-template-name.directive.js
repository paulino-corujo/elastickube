import './ek-template-name.less';
import Directive from 'directive';
import template from './ek-template-name.html';

class TemplateNameDirective extends Directive {
    constructor() {
        super({ template });

        this.scope = {
            template: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-template-name');
    }
}

export default TemplateNameDirective;

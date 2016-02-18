import './ek-admin-templates.less';
import Directive from 'directive';
import template from './ek-admin-templates.html';

class AdminTemplatesDirective extends Directive {
    constructor() {
        super({ template });
    }

    compile(tElement) {
        tElement
            .addClass('ek-admin-templates')
            .attr('layout', 'column');
    }
}

export default AdminTemplatesDirective;

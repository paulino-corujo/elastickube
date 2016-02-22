import './ek-admin-templates.less';
import Directive from 'directive';
import Controller from './ek-admin-templates.controller';
import template from './ek-admin-templates.html';

class AdminTemplatesDirective extends Directive {
    constructor() {
        super({ Controller, template });
    }

    compile(tElement) {
        tElement.addClass('ek-admin-templates');
    }
}

export default AdminTemplatesDirective;

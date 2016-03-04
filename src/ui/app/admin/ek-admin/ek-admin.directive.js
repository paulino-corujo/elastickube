import './ek-admin.less';
import Directive from 'directive';
import Controller from './ek-admin.controller';
import template from './ek-admin.html';

class AdminDirective extends Directive {
    constructor() {
        super({ Controller, template });
    }

    compile(tElement) {
        tElement
            .addClass('ek-admin')
            .attr('layout', 'column');
    }
}

export default AdminDirective;

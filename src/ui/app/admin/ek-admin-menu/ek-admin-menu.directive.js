import './ek-admin-menu.less';
import Directive from 'directive';
import Controller from './ek-admin-menu.controller';
import template from './ek-admin-menu.html';

class AdminMenuDirective extends Directive {
    constructor() {
        super({ Controller, template });
    }

    compile(tElement) {
        tElement
            .addClass('ek-admin-menu')
            .attr('layout', 'column');
    }
}

export default AdminMenuDirective;

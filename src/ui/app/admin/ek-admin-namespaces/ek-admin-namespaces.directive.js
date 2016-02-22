import './ek-admin-namespaces.less';
import Directive from 'directive';
import Controller from './ek-admin-namespaces.controller';
import template from './ek-admin-namespaces.html';

class AdminNamespacesDirective extends Directive {
    constructor() {
        super({ Controller, template });
    }

    compile(tElement) {
        tElement.addClass('ek-admin-namespaces');
    }
}

export default AdminNamespacesDirective;

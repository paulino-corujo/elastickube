import './ek-admin-namespaces.less';
import Directive from 'directive';
import template from './ek-admin-namespaces.html';

class AdminNamespacesDirective extends Directive {
    constructor() {
        super({ template });
    }

    compile(tElement) {
        tElement
            .addClass('ek-admin-namespaces')
            .attr('layout', 'column');
    }
}

export default AdminNamespacesDirective;

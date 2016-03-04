import './ek-admin.less';
import Directive from 'directive';
import template from './ek-admin.html';

class AdminDirective extends Directive {
    constructor() {
        super({ template });
    }

    compile(tElement) {
        tElement
            .addClass('ek-admin')
            .attr('layout', 'column');
    }
}

export default AdminDirective;

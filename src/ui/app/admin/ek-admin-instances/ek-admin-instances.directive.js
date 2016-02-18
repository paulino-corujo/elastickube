import './ek-admin-instances.less';
import Directive from 'directive';
import template from './ek-admin-instances.html';

class AdminInstancesDirective extends Directive {
    constructor() {
        super({ template });
    }

    compile(tElement) {
        tElement
            .addClass('ek-admin-instances')
            .attr('layout', 'column');
    }
}

export default AdminInstancesDirective;

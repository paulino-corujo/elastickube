import './ek-admin-instances.less';
import Directive from 'directive';
import Controller from './ek-admin-instances.controller';
import template from './ek-admin-instances.html';

class AdminInstancesDirective extends Directive {
    constructor() {
        super({ Controller, template });
    }

    compile(tElement) {
        tElement.addClass('ek-admin-instances');
    }
}

export default AdminInstancesDirective;

import './ek-admin-users.less';
import Directive from 'directive';
import Controller from './ek-admin-users.controller';
import template from './ek-admin-users.html';

class AdminUsersDirective extends Directive {
    constructor() {
        super({ Controller, template });
    }

    compile(tElement) {
        tElement
            .addClass('ek-admin-users');
    }
}

export default AdminUsersDirective;

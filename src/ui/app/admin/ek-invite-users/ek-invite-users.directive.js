import './ek-invite-users.less';
import Directive from 'directive';
import Controller from './ek-invite-users.controller';
import template from './ek-invite-users.html';

class AdminUsersDirective extends Directive {
    constructor() {
        super({ Controller, template });
    }

    compile(tElement) {
        tElement.addClass('ek-invite-users');
    }
}

export default AdminUsersDirective;

import './ek-select-users.less';
import Directive from 'directive';
import Controller from './ek-select-users.controller';
import template from './ek-select-users.html';

class SelectUsersDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            selectedUsers: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-select-users');
    }
}

export default SelectUsersDirective;

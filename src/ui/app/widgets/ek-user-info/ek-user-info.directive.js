import './ek-user-info.less';
import Directive from 'directive';
import Controller from './ek-user-info.controller';
import template from './ek-user-info.html';

class UserInfoDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            userId: '=',
            showId: '@?'
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-user-info')
            .attr('layout', 'row')
            .attr('layout-align', 'start center');
    }
}

export default UserInfoDirective;

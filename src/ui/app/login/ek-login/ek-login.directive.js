import './ek-login.less';
import Directive from 'directive';
import Controller from './ek-login.controller';
import template from './ek-login.html';

class LoginDirective extends Directive {
    constructor() {
        super({ Controller, template });
    }

    compile(tElement) {
        tElement
            .addClass('ek-login')
            .attr('layout', 'column');
    }
}

export default LoginDirective;

import './ek-login.less';
import Directive from 'directive';
import template from './ek-login.html';

class LoginDirective extends Directive {
    constructor() {
        super({ template });
    }

    compile(tElement) {
        tElement
            .addClass('ek-login')
            .attr('layout', 'column');
    }
}

export default LoginDirective;

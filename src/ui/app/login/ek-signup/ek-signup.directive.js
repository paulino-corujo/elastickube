import './ek-signup.less';
import Directive from 'directive';
import Controller from './ek-signup.controller';
import template from './ek-signup.html';

class SignupDirective extends Directive {
    constructor() {
        super({ Controller, template });
    }

    compile(tElement) {
        tElement
            .addClass('ek-signup')
            .attr('layout', 'column');
    }
}

export default SignupDirective;

import './ek-signup.less';
import Directive from 'directive';
import template from './ek-signup.html';

class SignupDirective extends Directive {
    constructor() {
        super({ template });
    }

    compile(tElement) {
        tElement
            .addClass('ek-signup')
            .attr('layout', 'column');
    }
}

export default SignupDirective;

import './ek-login.less';
import Directive from 'directive';
import Controller from './ek-login.controller';
import constants from '../../widgets/constants';
import template from './ek-login.html';

class LoginDirective extends Directive {
    constructor() {
        super({ Controller, template });
    }

    compile(tElement) {
        tElement
            .addClass('ek-login')
            .attr('layout', 'column');

            return ($scope) => _.extend($scope, constants);
    }
}

export default LoginDirective;

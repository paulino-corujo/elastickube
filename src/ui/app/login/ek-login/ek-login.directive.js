import './ek-login.less';
import Directive from 'directive';
import Controller from './ek-login.controller';
import icons from '../icons';
import template from './ek-login.html';

class LoginDirective extends Directive {

    constructor() {
        super({ Controller, template });

        this.bindToController = {
            authProviders: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-login')
            .attr('layout', 'column');

        return ($scope) => $scope.icons = icons;
    }
}

export default LoginDirective;

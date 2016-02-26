import './ek-validate-user.less';
import icons from '../icons';
import Directive from 'directive';
import Controller from './ek-validate-user.controller';
import template from './ek-validate-user.html';

class SignupDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            authProviders: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-validate-user')
            .attr('layout', 'column');

        return ($scope) => $scope.icons = icons;
    }
}

export default SignupDirective;

import './ek-signup.less';
import icons from '../icons';
import Directive from 'directive';
import Controller from './ek-signup.controller';
import template from './ek-signup.html';

class SignupDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            authProviders: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-signup')
            .attr('layout', 'column');

        return ($scope) => $scope.icons = icons;
    }
}

export default SignupDirective;

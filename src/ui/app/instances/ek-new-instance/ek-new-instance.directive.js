import './ek-new-instance.less';
import constants from '../constants';
import Directive from 'directive';
import Controller from './ek-new-instance.controller';
import template from './ek-new-instance.html';

class NewInstanceDirective extends Directive {
    constructor() {
        super({ Controller, template });
    }

    compile(tElement) {
        tElement
            .addClass('ek-new-instance')
            .attr('layout', 'column');

        return ($scope) => $scope.icons = constants.icons;
    }
}

export default NewInstanceDirective;

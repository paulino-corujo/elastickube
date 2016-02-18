import './ek-templates.less';
import Directive from 'directive';
import constants from '../constants';
import Controller from './ek-templates.controller';
import template from './ek-templates.html';

class TemplatesDirective extends Directive {
    constructor() {
        super({ Controller, template });
    }

    compile(tElement) {
        tElement
            .addClass('ek-templates')
            .attr('layout', 'column');

        return ($scope) => _.extend($scope, constants);
    }
}

export default TemplatesDirective;

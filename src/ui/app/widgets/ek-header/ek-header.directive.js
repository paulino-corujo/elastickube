import './ek-header.less';
import Directive from 'directive';
import Controller from './ek-header.controller';
import constants from '../constants';
import template from './ek-header.html';

class HeaderDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.scope = true;
    }

    compile(tElement) {
        tElement
            .addClass('ek-header')
            .attr('layout', 'row')
            .attr('layout-align', 'start');

        return ($scope) => _.extend($scope, constants);
    }
}

export default HeaderDirective;

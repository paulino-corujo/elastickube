import './ek-table.less';
import Directive from 'directive';
import Controller from './ek-table.controller';
import constants from '../constants';
import template from './ek-table.html';

class TableDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.transclude = true;
        this.bindToController = {
            headers: '=',
            initialSelection: '=',
            initialOrder: '@'
        };
    }

    compile(tElement) {
        tElement.addClass('ek-table');

        return ($scope, iElement, iAttrs, $controller) => {
            _.extend($scope, constants);

            $controller.currentSelection = $controller.initialSelection;
            $controller.sortOrder = $controller.initialOrder;
        };
    }
}

export default TableDirective;

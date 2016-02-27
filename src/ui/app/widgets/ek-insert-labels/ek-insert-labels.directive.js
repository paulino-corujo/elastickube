import './ek-insert-labels.less';
import constants from '../constants';
import Directive from 'directive';
import Controller from './ek-insert-labels.controller';
import template from './ek-insert-labels.html';

class InsertLabelsDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            labels: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-insert-labels');

        return ($scope) => _.extend($scope, constants);
    }
}

export default InsertLabelsDirective;

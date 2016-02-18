import './ek-owners-selector.less';
import Directive from 'directive';
import Controller from './ek-owners-selector.controller';
import constants from '../constants';
import template from './ek-owners-selector.html';

class OwnersSelectorDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            shareables: '=',
            selectedOwners: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-owners-selector');

        return ($scope) => _.extend($scope, constants);
    }
}

export default OwnersSelectorDirective;

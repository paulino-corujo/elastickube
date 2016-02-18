import './ek-instance-labels.less';
import Directive from 'directive';
import constants from '../constants';
import template from './ek-instance-labels.html';

class InstanceLabelsDirective extends Directive {
    constructor() {
        super({ template });

        this.scope = {
            instance: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-instance-labels');

        return ($scope) => _.extend($scope, constants);
    }
}

export default InstanceLabelsDirective;

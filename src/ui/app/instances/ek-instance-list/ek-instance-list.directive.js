import './ek-instance-list.less';
import Directive from 'directive';
import Controller from './ek-instance-list.controller';
import template from './ek-instance-list.html';

class InstanceListDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            instances: '=?'
        };
    }

    compile(tElement) {
        tElement.addClass('ek-instance-list');

        return ($scope, $element, $attrs, ctrl) => {
            const ekTableCtrl = $element.find('.ek-table').controller('ekTable');

            ekTableCtrl.headerClickListener = ctrl.sortByCallback.bind(ctrl);
        };
    }
}

export default InstanceListDirective;

import './ek-label-editor.less';
import Directive from 'directive';
import constants from '../constants';
import Controller from './ek-label-editor.controller';
import template from './ek-label-editor.html';

class LabelEditorDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            setLabelsCallback: '&'
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-label-editor')
            .attr('layout', 'column');

        return ($scope, $element, attrs, ctrl) => {
            _.extend($scope, constants);
            if (_.isFunction(ctrl.setLabelsCallback())) {
                ctrl.setLabelsCallback = ctrl.setLabelsCallback();
            }
        };
    }
}

export default LabelEditorDirective;

import './ek-confirm.less';
import Directive from 'directive';
import Controller from './ek-confirm.controller';
import template from './ek-confirm.html';

class ConfirmDirective extends Directive {

    constructor($compile) {
        super({ Controller, template });

        this._$compile = $compile;
    }

    compile(tElement) {
        tElement.addClass('ek-confirm');

        return ($scope, $element, attrs, ctrl) => {
            if (ctrl.options.template) {
                const compiledElement = this._$compile(
                    `<md-dialog-content class="ek-confirm__dialog__content">
                        ${ctrl.options.template}
                    </md-dialog-content>`)($scope);

                $element.find('.ek-confirm__dialog').append(compiledElement);
            }
        };
    }
}

export default ConfirmDirective;

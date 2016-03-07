import Directive from 'directive';

class FocusDirective extends Directive {
    constructor($timeout) {
        'ngInject';

        super();

        this._$timeout = $timeout;
        this.scope = false;
        this.restrict = 'A';
    }

    compile() {
        return ($scope, $element) => {
            if ($element.is('a, button, :input, [tabindex]')) {
                $element.focus();
            } else {
                const focusableElements = $element.find(
                    '[tabindex]:first, button:visible:enabled:first, a:visible:enabled:first, :input:visible:enabled:not([readonly]):first'
                );

                if (_.size(focusableElements) > 0) {
                    focusableElements[0].focus();
                }
            }
        };
    }
}

export default FocusDirective;


import './ek-drop-content.less';
import Directive from 'directive';

class DropContentDirective extends Directive {
    constructor() {
        super();
        this.require = '^ekDrop';
    }

    compile(tElement) {
        tElement.addClass('ek-drop-content');

        return ($scope, $element, $attrs, uiDropCtrl) => {
            uiDropCtrl.content = $element[0];
        };
    }
}

export default DropContentDirective;

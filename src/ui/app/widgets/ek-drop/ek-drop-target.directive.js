import './ek-drop-target.less';
import Directive from 'directive';

class DropTargetDirective extends Directive {
    constructor() {
        super();
        this.require = '^ekDrop';
    }

    compile(tElement) {
        tElement.addClass('ek-drop-target');

        return ($scope, $element, $attrs, uiDropCtrl) => {
            uiDropCtrl.target = $element[0];
        };
    }
}

export default DropTargetDirective;

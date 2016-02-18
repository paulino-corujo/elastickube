import './ek-button-group.less';
import Directive from 'directive';
import template from './ek-button-group.html';

class ButtonGroupDirective extends Directive {
    constructor() {
        super({ template });

        this.scope = false;
        this.transclude = true;
    }

    compile(tElement) {
        tElement.addClass('ek-button-group');
    }
}

export default ButtonGroupDirective;

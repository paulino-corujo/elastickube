import './ek-namespace-selector.less';
import Directive from 'directive';
import Controller from './ek-namespace-selector.controller';
import template from './ek-namespace-selector.html';

class NamespaceSelectorDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.scope = true;
    }

    compile(tElement) {
        tElement
            .addClass('ek-namespace-selector')
            .attr('layout', 'row')
            .attr('layout-align', 'start');
    }
}

export default NamespaceSelectorDirective;

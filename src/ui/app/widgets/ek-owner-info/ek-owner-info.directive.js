import './ek-owner-info.less';
import Directive from 'directive';
import Controller from './ek-owner-info.controller';
import template from './ek-owner-info.html';

class OwnerInfoDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            shareable: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-owner-info')
            .attr('layout', 'row')
            .attr('layout-align', 'start center');
    }
}

export default OwnerInfoDirective;

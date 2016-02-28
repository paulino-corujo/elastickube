import './ek-ikon.less';
import Directive from 'directive';
import Controller from './ek-ikon.controller';
import template from './ek-ikon.html';

class IkonDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            icon: '=',
            name: '='
        };
    }
}

export default IkonDirective;

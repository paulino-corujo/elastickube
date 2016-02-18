import './ek-templates-sorter.less';
import Directive from 'directive';
import Controller from './ek-templates-sorter.controller';
import template from './ek-templates-sorter.html';

class TemplatesSorterDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            collectionToSort: '=',
            sortedCollection: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-templates-sorter');
    }
}

export default TemplatesSorterDirective;

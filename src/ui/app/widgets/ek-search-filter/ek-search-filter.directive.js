import './ek-search-filter.less';
import Directive from 'directive';
import Controller from './ek-search-filter.controller';
import constants from '../constants';
import template from './ek-search-filter.html';

class SearchFilterDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            collectionToBeFiltered: '=',
            filteredCollection: '=',
            searchField: '@'
        };
    }

    compile(tElement) {
        tElement.addClass('ek-search-filter');

        return ($scope) => _.extend($scope, constants);
    }
}

export default SearchFilterDirective;

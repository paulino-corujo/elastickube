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
            iconAlignment: '@',
            searchField: '@'
        };
    }

    compile(tElement) {
        tElement.addClass('ek-search-filter');

        return ($scope, $element, attrs) => {
            if (attrs.iconAlignment === 'left') {
                $element.addClass('ek-search-filter--lefticon');
            }
            _.extend($scope, constants);
        };
    }
}

export default SearchFilterDirective;

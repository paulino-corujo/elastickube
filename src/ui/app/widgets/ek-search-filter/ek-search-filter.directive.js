/*
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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

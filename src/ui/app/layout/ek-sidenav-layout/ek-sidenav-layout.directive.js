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

import './ek-sidenav-layout.less';
import template from './ek-sidenav-layout.html';

class SideNavLayoutDirective {
    constructor(multiTransclude) {
        'ngInject';

        this._multiTransclude = multiTransclude;

        this.restrict = 'E';
        this.transclude = true;
        this.template = template;
    }

    compile(tElement) {
        tElement.addClass('ek-sidenav-layout layout-row');

        return ($scope, $element, $attrs, controller, $transcludeFn) => {
            this._multiTransclude.transclude($element, $transcludeFn);
        };
    }
}

export default SideNavLayoutDirective;

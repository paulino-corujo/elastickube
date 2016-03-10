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

import './ek-application-layout.less';
import images from '../images';
import Directive from 'directive';
import Controller from './ek-application-layout.controller';
import template from './ek-application-layout.html';

class ApplicationLayoutDirective extends Directive {
    constructor(multiTransclude) {
        'ngInject';

        super({ Controller, template });

        this._multiTransclude = multiTransclude;

        this.transclude = true;
    }

    compile(tElement) {
        tElement.addClass('ek-application-layout layout-fill layout-column');

        return ($scope, $element, $attrs, controller, $transcludeFn) => {
            $scope.title = $attrs.title;
            $scope.images = images;

            this._multiTransclude.transclude($element, $transcludeFn);
        };
    }
}

export default ApplicationLayoutDirective;

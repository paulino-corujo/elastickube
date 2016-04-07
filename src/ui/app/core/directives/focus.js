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

import Directive from 'directive';

class FocusDirective extends Directive {
    constructor() {
        super();

        this.scope = false;
        this.restrict = 'A';
    }

    link($scope, $element) {
        $scope.$evalAsync(() => {
            if ($element.is('a, button, :input, [tabindex]')) {
                $element.focus();
            } else {
                const focusableElements = $element.find(
                    '[tabindex]:first, button:visible:enabled:first, a:visible:enabled:first, :input:visible:enabled:not([readonly]):first'
                );

                if (_.size(focusableElements) > 0) {
                    focusableElements[0].focus();
                }
            }
        });
    }
}

export default FocusDirective;


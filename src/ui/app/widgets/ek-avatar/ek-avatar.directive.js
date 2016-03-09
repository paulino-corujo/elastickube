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

import './ek-avatar.less';
import Directive from 'directive';
import DEFAULT_IMAGE from 'images/user-nophoto.svg';

class AvatarDirective extends Directive {
    constructor() {
        super();

        this.scope = {
            workspace: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-avatar');

        return ($scope, $element) => {
            $scope.$watch('workspace', (wks) => {
                $element.css('background-image', `url(${wks && wks.icon || DEFAULT_IMAGE})`);
            });
        };
    }
}

export default AvatarDirective;

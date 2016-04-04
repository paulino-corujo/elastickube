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

import './ek-instance-container-log.less';
import Directive from 'directive';
import Controller from './ek-instance-container-log.controller';
import template from './ek-instance-container-log.html';

class InstanceContainerLogDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            container: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-instance-container-log');

        return ($scope, $element) => {
            const scroller = $element.find('.ek-instance-container-log__content');

            const mousewheelHandler = (event) => {
                if (scroller.scrollTop() === 0 && event.originalEvent.deltaY < 0
                    || scroller.scrollTop() + scroller.innerHeight() >= scroller[0].scrollHeight && event.originalEvent.deltaY > 0) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            };

            $element.bind('mousewheel', mousewheelHandler);
            $scope.$on('$destroy', () => {
                $element.unbind('mousewheel', mousewheelHandler);
            });
        };
    }
}

export default InstanceContainerLogDirective;

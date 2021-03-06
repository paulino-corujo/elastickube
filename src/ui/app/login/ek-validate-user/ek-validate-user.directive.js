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

import './ek-validate-user.less';
import icons from '../icons';
import Directive from 'directive';
import Controller from './ek-validate-user.controller';
import template from './ek-validate-user.html';

class SignupDirective extends Directive {
    constructor() {
        super({ Controller, template });

        this.bindToController = {
            authProviders: '='
        };
    }

    compile(tElement) {
        tElement
            .addClass('ek-validate-user')
            .attr('layout', 'column');

        return ($scope) => $scope.icons = icons;
    }
}

export default SignupDirective;

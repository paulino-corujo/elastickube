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

import RouterHelper from './router-helper';

class RouterHelperProvider {
    constructor($stateProvider, $urlRouterProvider) {
        this._hasOtherwise = false;
        this._$stateProvider = $stateProvider;
        this._$urlRouterProvider = $urlRouterProvider;

        this.$get = ($state) => {
            'ngInject';

            return new RouterHelper($state);
        };
    }

    configureOtherwise(otherwise) {
        if (this._hasOtherwise) {
            throw new Error('Otherwise already configured');
        } else if (otherwise) {
            this._hasOtherwise = true;
            this._$urlRouterProvider.otherwise(otherwise);
        }
    }

    configureStates(states) {
        states.forEach((x) => this._$stateProvider.state(x.state, x.config));
    }
}

function routerHelperProvider($stateProvider, $urlRouterProvider) {
    'ngInject';

    return new RouterHelperProvider($stateProvider, $urlRouterProvider);
}

export default routerHelperProvider;

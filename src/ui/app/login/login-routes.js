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

import controller from './login-routes.controller';

const states = [{
    state: 'login',
    config: {
        controller,
        url: '/login',
        parent: 'anonymous',
        template: '<ek-login auth-providers="authProviders"></ek-login>',
        resolve: {
            authProviders: (settingsActionCreator) => {
                'ngInject';

                return settingsActionCreator.authProviders();
            }
        }
    }
}, {
    state: 'signup',
    config: {
        controller,
        url: '/signup',
        parent: 'anonymous',
        template: '<ek-signup></ek-signup>',
        resolve: {
            authProviders: (settingsActionCreator) => {
                'ngInject';

                return settingsActionCreator.authProviders();
            }
        }
    }
}, {
    state: 'validate',
    config: {
        controller,
        url: '/invite/:code',
        parent: 'anonymous',
        template: '<ek-validate-user auth-providers="authProviders"></ek-validate-user>',
        resolve: {
            authProviders: ($stateParams, settingsActionCreator) => {
                'ngInject';

                return settingsActionCreator.authProviders($stateParams.code);
            }
        }
    }
}];

function loginRoutes(routerHelperProvider) {
    'ngInject';

    routerHelperProvider.configureStates(states);
}

export default loginRoutes;

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

class LoginController {
    constructor($scope, initialization, instancesNavigationActionCreator, principalActionCreator) {
        'ngInject';

        this._$scope = $scope;
        this._initialization = initialization;
        this._instancesNavigationActionCreator = instancesNavigationActionCreator;
        this._principalActionCreator = principalActionCreator;
    }

    submit() {
        return this._principalActionCreator.login(this.user)
            .then(() => this._initialization.initializeLoggedInUser())
            .then(() => this._instancesNavigationActionCreator.instances())
            .catch(() => console.warn('Invalid User or Password.'));
    }
}

export default LoginController;

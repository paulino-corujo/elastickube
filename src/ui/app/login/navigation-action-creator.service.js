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

class NavigationActionCreatorService {
    constructor(routerHelper, sessionStore) {
        'ngInject';

        this._routerHelper = routerHelper;
        this._sessionStore = sessionStore;
    }

    login() {
        return this._routerHelper.changeToState('login');
    }

    signup() {
        return this._routerHelper.changeToState('signup');
    }

    validateUser() {
        return this._routerHelper.changeToState('validate-user');
    }

    resetPassword() {
        return this._routerHelper.changeToState('reset-password');
    }

    confirmResetPassword() {
        return this._routerHelper.changeToState('confirm-reset-password');
    }
}

export default NavigationActionCreatorService;

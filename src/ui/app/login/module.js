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

import 'angular-password';

import coreModule from 'core/module';

import loginRoutes from './login-routes';

import NavigationActionCreator from './navigation-action-creator.service';

import ChangePasswordDirective from './ek-change-password/ek-change-password.directive';
import ConfirmResetPasswordDirective from './ek-confirm-reset-password/ek-confirm-reset-password.directive';
import LoginDirective from './ek-login/ek-login.directive';
import ResetPasswordDirective from './ek-reset-password/ek-reset-password.directive';
import SignupDirective from './ek-signup/ek-signup.directive';
import ValidateUserDirective from './ek-validate-user/ek-validate-user.directive';

const moduleName = 'app.login';

angular
    .module(moduleName, [
        'ngPassword',
        coreModule
    ])
    .config(loginRoutes)

    .service('loginNavigationActionCreator', NavigationActionCreator)

    .directive('ekChangePassword', () => new ChangePasswordDirective())
    .directive('ekConfirmResetPassword', () => new ConfirmResetPasswordDirective())
    .directive('ekLogin', () => new LoginDirective())
    .directive('ekResetPassword', () => new ResetPasswordDirective())
    .directive('ekSignup', () => new SignupDirective())
    .directive('ekValidateUser', () => new ValidateUserDirective());

export default moduleName;

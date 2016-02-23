import 'angular-password';

import coreModule from 'core/module';

import loginRoutes from './login-routes';

import NavigationActionCreator from './navigation-action-creator.service';

import LoginDirective from './ek-login/ek-login.directive';
import SignupDirective from './ek-signup/ek-signup.directive';

const moduleName = 'app.login';

angular
    .module(moduleName, [
        'ngPassword',
        coreModule
    ])
    .config(loginRoutes)

    .service('loginNavigationActionCreator', NavigationActionCreator)

    .directive('ekLogin', () => new LoginDirective())
    .directive('ekSignup', () => new SignupDirective());

export default moduleName;

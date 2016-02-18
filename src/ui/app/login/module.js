import 'angular-password';

import coreModule from 'core/module';

import loginRoutes from './login-routes';
import LoginDirective from './ek-login/ek-login.directive';
import SignupDirective from './ek-signup/ek-signup.directive';

const moduleName = 'app.login';

angular
    .module(moduleName, [
        'ngPassword',
        coreModule
    ])
    .config(loginRoutes)
    .directive('ekLogin', () => new LoginDirective())
    .directive('ekSignup', () => new SignupDirective());

export default moduleName;

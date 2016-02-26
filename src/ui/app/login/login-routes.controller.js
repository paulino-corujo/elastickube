class LoginRouterController {

    constructor($scope, $state, authProviders, loginNavigationActionCreator) {
        'ngInject';

        if (hasValues(authProviders)) {
            if ($state.current.name === 'signup') {
                loginNavigationActionCreator.login();
            }
        } else if ($state.current.name === 'login') {
            loginNavigationActionCreator.signup();
        }

        $scope.authProviders = authProviders;
    }
}

function hasValues(obj) {
    return !_.chain(obj)
        .values()
        .compact()
        .isEmpty()
        .value();
}

export default LoginRouterController;

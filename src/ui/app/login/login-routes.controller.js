class LoginRouterController {

    constructor($scope, $state, authProviders, loginNavigationActionCreator) {
        'ngInject';

        if ($state.current.name === 'anonymous.login') {
            if (!hasValues(authProviders)) {
                loginNavigationActionCreator.signup();
            }
        } else if (hasValues(authProviders) && !_.has(authProviders, 'email')) {
            loginNavigationActionCreator.login();
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

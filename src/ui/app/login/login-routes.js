const states = [{
    state: 'anonymous.login',
    config: {
        template: '<ek-login auth-providers="authProviders"></ek-login>',
        url: '/login',
        controller: ($scope, authProviders) => {
            'ngInject';

            $scope.authProviders = authProviders;
        },
        resolve: {
            authProviders: (settingsActionCreator) => {
                'ngInject';

                return settingsActionCreator.authProviders();
            }
        }
    }
}, {
    state: 'anonymous.signup',
    config: {
        template: '<ek-signup></ek-signup>',
        url: '/signup'
    }
}];

function loginRoutes(routerHelperProvider) {
    'ngInject';

    routerHelperProvider.configureStates(states);
}

export default loginRoutes;

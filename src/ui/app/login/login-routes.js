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

import controller from './login-routes.controller'

const states = [{
    state: 'anonymous.login',
    config: {
        controller,
        url: '/login',
        template: '<ek-login auth-providers="authProviders"></ek-login>',
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
        controller,
        url: '/signup',
        template: '<ek-signup auth-providers="authProviders"></ek-signup>',
        resolve: {
            authProviders: ($location, settingsActionCreator) => {
                'ngInject';

                return settingsActionCreator.authProviders($location.hash());
            }
        }
    }
}];

function loginRoutes(routerHelperProvider) {
    'ngInject';

    routerHelperProvider.configureStates(states);
}

export default loginRoutes;

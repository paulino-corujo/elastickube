const states = [{
    state: 'anonymous.login',
    config: {
        template: '<ek-login></ek-login>',
        url: '/login'
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

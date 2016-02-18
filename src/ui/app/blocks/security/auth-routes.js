import profiles from './profiles';

const states = [{
    state: 'anonymous',
    config: {
        abstract: true,
        template: '<ui-view></ui-view>',
        data: {
            access: profiles.ANONYMOUS
        }
    }
}, {
    state: 'private',
    config: {
        abstract: true,
        template: '<ui-view></ui-view>',
        data: {
            access: profiles.PRIVATE
        }
    }
}];

function authRoutes(routerHelperProvider) {
    'ngInject';

    routerHelperProvider.configureStates(states);
}

export default authRoutes;

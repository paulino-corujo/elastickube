import profiles from 'blocks/security/profiles';

const states = [{
    state: 'admin',
    config: {
        template: '<ek-admin></ek-admin>',
        url: '/admin',
        data: {
            header: {
                name: 'admin',
                position: 3
            },
            access: profiles.ADMIN
        }
    }
}];

function adminRoutes(routerHelperProvider) {
    'ngInject';

    routerHelperProvider.configureStates(states);
}

export default adminRoutes;

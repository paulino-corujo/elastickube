import profiles from 'blocks/security/profiles';

const states = [{
    state: 'admin',
    config: {
        abstract: true,
        template: '<ek-admin></ek-admin>',
        url: '/admin',
        data: {
            access: profiles.ADMIN
        }
    }
}, {
    state: 'admin.settings',
    config: {
        template: '<ek-admin-settings></ek-admin-settings>',
        url: '/settings',
        data: {
            header: {
                name: 'admin',
                position: 3
            }
        }
    }
}, {
    state: 'admin.users',
    config: {
        template: '<ek-admin-users></ek-admin-users>',
        url: '/users',
        data: {
            header: {
                name: 'admin'
            }
        }
    }
}, {
    state: 'admin.namespaces',
    config: {
        template: '<ek-admin-namespaces></ek-admin-namespaces>',
        url: '/namespaces',
        data: {
            header: {
                name: 'admin'
            }
        }
    }
}, {
    state: 'admin.templates',
    config: {
        template: '<ek-admin-templates></ek-admin-templates>',
        url: '/templates',
        data: {
            header: {
                name: 'admin'
            }
        }
    }
}, {
    state: 'admin.instances',
    config: {
        template: '<ek-admin-instances></ek-admin-instances>',
        url: '/instances',
        data: {
            header: {
                name: 'admin'
            }
        }
    }
}];

function adminRoutes(routerHelperProvider) {
    'ngInject';

    routerHelperProvider.configureStates(states);
}

export default adminRoutes;

const states = [{
    state: 'private.instances',
    config: {
        url: '/:namespace/instances',
        template: '<ek-instances></ek-instances>',
        data: {
            header: {
                name: 'instances',
                position: 1,
                click: ($injector) => {
                    const actionCreator = $injector.get('instancesNavigationActionCreator');

                    return actionCreator.instances();
                }
            }
        },
        resolve: {
            loading: ($q, instancesStore, namespacesStore) => {
                'ngInject';

                return $q.all([instancesStore.isLoading(), namespacesStore.isLoading()]);
            }
        }
    }
}, {
    state: 'new-instance',
    config: {
        url: '/instances/new',
        parent: 'private',
        template: '<ek-new-instance></ek-new-instance>'
    }
}];

function instancesRoutes(routerHelperProvider) {
    'ngInject';

    routerHelperProvider.configureStates(states);
}

export default instancesRoutes;

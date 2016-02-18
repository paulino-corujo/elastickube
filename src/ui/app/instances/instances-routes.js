function instancesRoutes(routerHelperProvider) {
    'ngInject';

    const defaultNamespace = 'engineering';

    routerHelperProvider.configureStates([{
        state: 'private.instances',
        config: {
            template: '<ek-instances></ek-instances>',
            resolve: {
                loading: ($q, instancesStore, namespacesStore) => {
                    'ngInject';

                    return $q.all([instancesStore.loading(), namespacesStore.loading()]);
                }
            },
            url: '/:namespace/instances',
            data: {
                header: {
                    name: 'instances',
                    position: 1
                }
            }
        }
    }], `${defaultNamespace}/instances`);
}

export default instancesRoutes;

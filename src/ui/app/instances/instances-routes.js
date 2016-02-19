function instancesRoutes(routerHelperProvider) {
    'ngInject';

    routerHelperProvider.configureStates([{
        state: 'private.instances',
        config: {
            template: '<ek-instances></ek-instances>',
            resolve: {
                loading: ($q, instancesStore) => {
                    'ngInject';

                    return $q.all([instancesStore.isLoading()]);
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
    }]);
}

export default instancesRoutes;

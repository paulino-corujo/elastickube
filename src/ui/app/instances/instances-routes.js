function instancesRoutes(routerHelperProvider) {
    'ngInject';

    routerHelperProvider.configureStates([{
        state: 'private.instances',
        config: {
            url: '/:namespace/instances',
            template: '<ek-instances></ek-instances>',
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

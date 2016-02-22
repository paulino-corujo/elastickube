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
            },
            resolve: {
                authorization: ($stateParams, namespacesStore, routerHelper, sessionActionCreator, sessionStore) => {
                    'ngInject';

                    return namespacesStore.isLoading()
                        .then(() => {
                            if (!_.includes(namespacesStore.getAll(), $stateParams.namespace)) {
                                const namespace = sessionStore.getActiveNamespace() || _.first(namespacesStore.getAll());

                                return sessionActionCreator.selectNamespace(namespace)
                                    .then(() => {
                                        routerHelper.changeToState('private.instances', { namespace }, { reload: true });
                                    });
                            }
                        });
                },
                loading: ($q, instancesStore, namespacesStore) => {
                    'ngInject';

                    return $q.all([instancesStore.isLoading(), namespacesStore.isLoading()])
                        .then(() => console.log('loaded'));
                }
            }
        }
    }]);
}

export default instancesRoutes;

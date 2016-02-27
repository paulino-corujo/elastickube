function instancesRoutes(routerHelperProvider) {
    'ngInject';

    routerHelperProvider.configureStates([{
        state: 'instances',
        config: {
            url: '/:namespace/instances',
            parent: 'private',
            template: '<ek-instances></ek-instances>',
            controller: (checkNamespace) => {
                'ngInject';

                checkNamespace.execute();
            },
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
        state: 'instance',
        config: {
            url: '/:namespace/instances/{instanceId:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}}',
            parent: 'private',
            template: '<ek-instance instance="instance"></ek-instance>',
            controller: ($scope, $stateParams, checkNamespace, instancesStore) => {
                'ngInject';
                const namespace = $stateParams.namespace;
                const instanceId = $stateParams.instanceId;

                checkNamespace.execute();

                $scope.instance = _.find(instancesStore.getAll(), (x) => _.matchesProperty('metadata.namespace', namespace)(x)
                    && _.matchesProperty('metadata.uid', instanceId)(x));
            },
            data: {
                header: {
                    name: 'instances'
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
            template: '<ek-new-instance></ek-new-instance>',
            data: {
                header: {
                    name: 'instances'
                }
            }
        }
    }]);
}

// a234a27a-da15-11e5-8bc0-0800277146a7

export default instancesRoutes;

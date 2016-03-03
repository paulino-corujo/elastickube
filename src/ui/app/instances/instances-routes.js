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
            template: '<ek-instance></ek-instance>',
            controller: ($scope, $stateParams, checkNamespace, instanceActionCreator, instancesStore) => {
                'ngInject';
                const namespace = $stateParams.namespace;
                const instanceId = $stateParams.instanceId;

                checkNamespace.execute();

                const instance = _.find(instancesStore.getAll(),
                    (x) => _.matchesProperty('metadata.namespace', namespace)(x) && _.matchesProperty('metadata.uid', instanceId)(x));

                $scope.$on('$destroy', () => instanceActionCreator.unsubscribe(instance));
            },
            data: {
                header: {
                    name: 'instances'
                }
            },
            resolve: {
                loading: ($q, $stateParams, instanceActionCreator, instancesStore, namespacesStore) => {
                    'ngInject';

                    return $q.all([instancesStore.isLoading(), namespacesStore.isLoading()])
                        .then(() => {
                            const instance = instancesStore.get($stateParams.instanceId);

                            return instanceActionCreator.subscribe(instance);
                        });
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

export default instancesRoutes;

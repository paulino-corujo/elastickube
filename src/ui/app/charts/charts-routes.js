const states = [{
    state: 'charts',
    config: {
        parent: 'private',
        template: '<ek-charts></ek-charts>',
        url: '/:namespace/charts',
        data: {
            header: {
                name: 'charts',
                position: 2,
                click: ($injector) => {
                    const actionCreator = $injector.get('chartsNavigationActionCreator');

                    return actionCreator.charts();
                }
            },
            resolve: {
                loading: ($q, chartsStore, namespacesStore) => {
                    'ngInject';

                    return $q.all([chartsStore.isLoading(), namespacesStore.isLoading()]);
                }
            }
        }
    }
}];

function chartsRoutes(routerHelperProvider) {
    'ngInject';

    routerHelperProvider.configureStates(states);
}

export default chartsRoutes;

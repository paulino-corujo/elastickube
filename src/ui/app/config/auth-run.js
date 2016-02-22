function checkRouteAccess($rootScope, auth, routerHelper, initialization) {
    'ngInject';

    $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState) => {
        if (initialization.initialized) {
            if (!auth.authorize(toState.data.access)) {
                event.preventDefault();

                if (fromState.url === '^') {
                    if (auth.isLoggedIn()) {
                        const defaultNamespace = 'engineering';

                        routerHelper.changeToState('private.instances', { namespace: defaultNamespace });
                    } else {
                        routerHelper.changeToState('anonymous.login');
                    }
                }
            }
        } else {
            event.preventDefault();

            initialization.deferred.promise.then(() => {
                routerHelper.changeToState(toState, toParams);
            });
        }
    });
}

export default checkRouteAccess;

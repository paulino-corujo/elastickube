function checkRouteAccess($rootScope, auth, routerHelper) {
    'ngInject';

    $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState) => {
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
    });
}

export default checkRouteAccess;

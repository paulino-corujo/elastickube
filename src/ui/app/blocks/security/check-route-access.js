function checkRouteAccess($rootScope, auth) {
    'ngInject';

    $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState) => {
        if (!auth.authorize(toState.data.access)) {
            event.preventDefault();

            if (fromState.url === '^') {
                if (auth.isLoggedIn()) {
                    auth.unauthorizedNotLoggedStateChange();
                } else {
                    auth.unauthorizedLoggedStateChange();
                }
            }
        }
    });
}

export default checkRouteAccess;

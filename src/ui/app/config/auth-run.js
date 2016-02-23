function checkRouteAccess($rootScope, auth, initialization, instancesNavigationActionCreator, loginNavigationActionCreator, routerHelper) {
    'ngInject';

    $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState) => {
        if (initialization.initialized) {
            if (!auth.authorize(toState.data.access)) {
                event.preventDefault();

                if (fromState.url === '^') {
                    if (auth.isLoggedIn()) {
                        instancesNavigationActionCreator.instances();
                    } else {
                        loginNavigationActionCreator.login();
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

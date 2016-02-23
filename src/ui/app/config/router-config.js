function routerConfiguration($locationProvider, routerHelperProvider) {
    'ngInject';

    $locationProvider.html5Mode(true);

    routerHelperProvider.configureOtherwise(($injector) => {
        const auth = $injector.get('auth');
        const instancesNavigationActionCreator = $injector.get('instancesNavigationActionCreator');
        const loginNavigationActionCreator = $injector.get('loginNavigationActionCreator');

        return auth.isLoggedIn() ? instancesNavigationActionCreator.instances() : loginNavigationActionCreator.login();
    });
}

export default routerConfiguration;

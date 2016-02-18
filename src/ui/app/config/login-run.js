function loginConfiguration($rootScope, $injector, auth) {
    'ngInject';

    $injector.get('sessionStore');
    $injector.get('instancesStore');
    $injector.get('namespacesStore');

    if (auth.isLoggedIn()) {
        loadInitialData($injector);
    }

    $rootScope.$on('session.initialized', () => {
        loadInitialData($injector);
    });
}

function loadInitialData($injector) {
    $injector.get('namespacesActionCreator').load()
        .then(() => {
            const sessionStore = $injector.get('sessionStore');
            let namespace = sessionStore.getActiveNamespace();

            if (_.isUndefined(namespace)) {
                namespace = _.chain($injector.get('namespacesStore').getAll())
                    .first()
                    .value();
            }

            $injector.get('sessionActionCreator').selectNamespace(namespace);
        });
}

export default loginConfiguration;

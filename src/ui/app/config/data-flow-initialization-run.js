function dataFlowInitialization($injector, principalStore, sessionStore, websocketClient) {
    'ngInject';

    $injector.get('sessionStore');
    $injector.get('instancesStore');
    $injector.get('namespacesStore');
    $injector.get('usersStore');

    principalStore.addPrincipalChangeListener(() => {
        if (_.isUndefined(principalStore.getPrincipal())) {
            websocketClient.disconnect();
        } else {
            websocketClient.connect();
        }
    });
}

export default dataFlowInitialization;

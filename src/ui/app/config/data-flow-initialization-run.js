function dataFlowInitialization($injector) {
    'ngInject';

    $injector.get('chartsStore');
    $injector.get('instanceStore');
    $injector.get('instancesStore');
    $injector.get('namespacesStore');
    $injector.get('principalStore');
    $injector.get('sessionStore');
    $injector.get('settingsStore');
    $injector.get('usersStore');

    $injector.get('chartsActionCreator');
    $injector.get('instanceActionCreator');
    $injector.get('instancesActionCreator');
    $injector.get('namespacesActionCreator');
    $injector.get('principalActionCreator');
    $injector.get('sessionActionCreator');
    $injector.get('settingsActionCreator');
    $injector.get('usersActionCreator');
}

export default dataFlowInitialization;

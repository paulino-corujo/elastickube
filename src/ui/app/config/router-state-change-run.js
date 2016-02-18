import constants from 'constants';

function routerStateChange($rootScope, $state, sessionStore, routerHelper) {
    'ngInject';

    $rootScope.$on(constants.NAVIGATE_TO, (event, section) => {
        const namespace = sessionStore.getActiveNamespace();

        routerHelper.changeToState(section.name, { namespace });
    });

    sessionStore.addNamespaceChangeListener(() => {
        const namespace = sessionStore.getActiveNamespace();

        if ($state.current.url !== '^') {
            routerHelper.changeToState($state.current.name, { namespace });
        }
    });
}

export default routerStateChange;

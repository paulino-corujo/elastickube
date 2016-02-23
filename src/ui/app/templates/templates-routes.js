const states = [{
    state: 'private.templates',
    config: {
        template: '<ek-templates></ek-templates>',
        url: '/:namespace/templates',
        data: {
            header: {
                name: 'templates',
                position: 2,
                click: ($injector) => {
                    const actionCreator = $injector.get('templatesNavigationActionCreator');

                    return actionCreator.templates();
                }
            }
        }
    }
}];

function templatesRoutes(routerHelperProvider) {
    'ngInject';

    routerHelperProvider.configureStates(states);
}

export default templatesRoutes;

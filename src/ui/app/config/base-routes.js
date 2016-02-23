import profiles from 'core/security/profiles';
import anonymousTemplate from './anonymous.template.html';
import privateTemplate from './private.template.html';

const states = [{
    state: 'anonymous',
    config: {
        abstract: true,
        template: anonymousTemplate,
        data: {
            access: profiles.ANONYMOUS
        }
    }
}, {
    state: 'private',
    config: {
        abstract: true,
        template: privateTemplate,
        data: {
            access: profiles.PRIVATE
        }
    }
}];

function authRoutes(routerHelperProvider) {
    'ngInject';

    routerHelperProvider.configureStates(states);
}

export default authRoutes;

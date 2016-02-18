function authConfiguration(auth, routerHelper) {
    'ngInject';

    auth.unauthorizedLoggedStateChange = () => routerHelper.changeToState('anonymous.login');

    auth.unauthorizedNotLoggedStateChange = () => {
        const defaultNamespace = 'engineering';

        routerHelper.changeToState('private.instances', { namespace: defaultNamespace });
    };
}

export default authConfiguration;

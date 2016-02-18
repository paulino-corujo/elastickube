import AuthService from './auth.service';

class AuthProvider {
    constructor() {
        this.$get = ($rootScope, $cookies, routerHelper, session) => {
            'ngInject';

            return new AuthService($rootScope, $cookies, routerHelper, session);
        };
    }
}

function authProvider() {
    return new AuthProvider();
}

export default authProvider;

import AuthService from './auth.service';

class AuthProvider {
    constructor() {
        this.$get = ($cookies, routerHelper, session) => {
            'ngInject';

            return new AuthService($cookies, routerHelper, session);
        };
    }
}

function authProvider() {
    return new AuthProvider();
}

export default authProvider;

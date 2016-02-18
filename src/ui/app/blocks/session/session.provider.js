import SessionService from './session.service';

class SessionProvider {
    constructor() {
        this.$get = ($q, storage) => {
            'ngInject';

            return new SessionService($q, storage);
        };
    }
}

function sessionProvider() {
    return new SessionProvider();
}

export default sessionProvider;

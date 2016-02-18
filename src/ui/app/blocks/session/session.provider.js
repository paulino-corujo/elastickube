import SessionService from './session.service';

class SessionProvider {
    constructor() {
        this.$get = (storage) => {
            'ngInject';

            return new SessionService(storage);
        };
    }
}

function sessionProvider() {
    return new SessionProvider();
}

export default sessionProvider;

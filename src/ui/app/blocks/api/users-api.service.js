class UsersAPIService {

    constructor(websocketClient) {
        'ngInject';

        this._websocketClient = websocketClient;
    }

    subscribe() {
        return this._websocketClient.subscribeEvent('users');
    }

    update(user) {
        return this._websocketClient.updateEvent('users', user);
    }
}

export default UsersAPIService;

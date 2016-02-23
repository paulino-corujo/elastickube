class UsersAPIService {

    constructor(websocketClient) {
        'ngInject';

        this._websocketClient = websocketClient;
    }

    subscribe() {
        return this._websocketClient.subscribeEvent('users');
    }
}

export default UsersAPIService;

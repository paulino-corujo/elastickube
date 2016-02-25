import AbstractAPI from './abstract-api';

class UsersAPIService extends AbstractAPI {

    constructor(websocketClient) {
        'ngInject';

        super('users', websocketClient);
    }
}

export default UsersAPIService;

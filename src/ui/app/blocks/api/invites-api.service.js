import AbstractAPI from './abstract-api';

class UsersAPIService extends AbstractAPI {

    constructor(websocketClient) {
        'ngInject';

        super('invitations', websocketClient);
    }
}

export default UsersAPIService;

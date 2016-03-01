import AbstractAPI from './abstract-api';

class InstanceAPIService extends AbstractAPI {

    constructor(websocketClient) {
        'ngInject';

        super('instance', websocketClient);
    }
}

export default InstanceAPIService;

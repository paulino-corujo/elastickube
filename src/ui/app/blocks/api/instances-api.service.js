import AbstractAPI from './abstract-api';

class InstancesAPIService extends AbstractAPI {

    constructor(websocketClient) {
        'ngInject';

        super('instances', websocketClient);
    }
}

export default InstancesAPIService;

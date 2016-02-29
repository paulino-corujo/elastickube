import AbstractAPI from './abstract-api';

class InstancesAPIService extends AbstractAPI {

    constructor(websocketClient) {
        'ngInject';

        super('instances', websocketClient);
    }

    deploy(body) {
        return this.create(body);
    }
}

export default InstancesAPIService;

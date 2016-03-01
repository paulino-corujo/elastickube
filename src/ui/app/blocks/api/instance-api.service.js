import AbstractAPI from './abstract-api';

class InstancesAPIService extends AbstractAPI {

    constructor(websocketClient) {
        'ngInject';

        super('instance', websocketClient);
    }

    deploy(body) {
        return this.create(body);
    }

    subscribe() {
    }

    unsubscribe() {
    }
}

export default InstancesAPIService;

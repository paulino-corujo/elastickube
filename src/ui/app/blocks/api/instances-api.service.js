class InstancesAPIService {

    constructor(websocketClient) {
        'ngInject';

        this._websocketClient = websocketClient;
    }

    subscribe(namespace) {
        return this._websocketClient.subscribeEvent('instances', namespace);
    }
}

export default InstancesAPIService;

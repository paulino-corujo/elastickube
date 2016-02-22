class InstancesAPIService {

    constructor(websocketClient) {
        'ngInject';

        this._websocketClient = websocketClient;
    }

    unsubscribe() {
        return this._websocketClient.unSubscribeEvent('instances');
    }

    subscribe(namespace) {
        return this._websocketClient.subscribeEvent('instances', namespace);
    }
}

export default InstancesAPIService;

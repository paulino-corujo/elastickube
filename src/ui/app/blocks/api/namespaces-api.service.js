class NamespacesAPIService {

    constructor(websocketClient) {
        'ngInject';

        this._websocketClient = websocketClient;
    }

    subscribe() {
        return this._websocketClient.subscribeEvent('namespaces');
    }
}

export default NamespacesAPIService;

class ChartsAPIService {

    constructor(websocketClient) {
        'ngInject';

        this._websocketClient = websocketClient;
    }

    subscribe() {
        return this._websocketClient.subscribeEvent('charts');
    }
}

export default ChartsAPIService;

import AbstractAPI from './abstract-api';

class ChartsAPIService extends AbstractAPI {

    constructor(websocketClient) {
        'ngInject';

        super('charts', websocketClient);
    }
}

export default ChartsAPIService;

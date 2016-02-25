import AbstractAPI from './abstract-api';

class NamespacesAPIService extends AbstractAPI {

    constructor(websocketClient) {
        'ngInject';

        super('namespaces', websocketClient);
    }
}

export default NamespacesAPIService;

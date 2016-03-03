import AbstractAPI from './abstract-api';

class EventsAPIService extends AbstractAPI {

    constructor(websocketClient) {
        'ngInject';

        super('instance', websocketClient);
    }
}

export default EventsAPIService;

import AbstractAPI from './abstract-api';

class InstancesAPIService extends AbstractAPI {

    constructor($q, websocketClient) {
        'ngInject';

        super('instances', websocketClient);

        this._$q = $q;
    }

    deploy(chart, deployInfo) {
        const defer = this._$q.defer();

        setTimeout(() => {
            defer.resolve();
        }, 0);

        return defer.promise;
    }
}

export default InstancesAPIService;

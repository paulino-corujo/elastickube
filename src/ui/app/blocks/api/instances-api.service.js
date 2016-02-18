import mockInstances from 'mocks/instances';

class InstancesAPIService {

    constructor($q) {
        'ngInject';

        this._$q = $q;
    }

    loadInstances(namespace) {
        const defer = this._$q.defer();

        // FIXME SIMULATED CALLBACK
        setTimeout(() => {
            defer.resolve(_.isUndefined(namespace) ? mockInstances.default : mockInstances[namespace]);
        }, 0);
        return defer.promise;
    }
}

export default InstancesAPIService;

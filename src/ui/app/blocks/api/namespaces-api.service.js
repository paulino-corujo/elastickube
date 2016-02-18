import mockNamespaces from 'mocks/namespaces';

class InstancesAPIService {

    constructor($q) {
        'ngInject';

        this._$q = $q;
    }

    loadNamespaces() {
        const defer = this._$q.defer();

        setTimeout(() => {
            defer.resolve(mockNamespaces);
        }, 0);
        return defer.promise;
    }
}

export default InstancesAPIService;

import mockUsers from 'mocks/users';

class UsersAPIService {

    constructor($q) {
        'ngInject';

        this._$q = $q;
    }

    subscribe() {
        const defer = this._$q.defer();

        setTimeout(() => {
            defer.resolve(mockUsers);
        }, 0);
        return defer.promise;
    }
}

export default UsersAPIService;

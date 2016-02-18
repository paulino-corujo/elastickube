class PrincipalAPIService {

    constructor($http) {
        'ngInject';

        this._$http = $http;
    }

    signup(user) {
        return this._$http.post('/api/v1/auth/signup', user);
    }

    login(user) {
        return this._$http.post('/api/v1/auth/login', user);
    }
}

export default PrincipalAPIService;

import AbstractAPI from './abstract-api';

class PrincipalAPIService extends AbstractAPI {

    constructor($http, websocketClient) {
        'ngInject';

        super('principal', websocketClient);

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

import AbstractAPI from './abstract-api';

class PrincipalAPIService extends AbstractAPI {

    constructor($http, websocketClient) {
        'ngInject';

        super('principal', websocketClient);

        this._$http = $http;
    }

    signup(user, code) {
        const options = {
            headers: {
                'ElasticKube-Validation-Token': code
            }
        };

        /* eslint no-undefined: 0 */
        return this._$http.post('/api/v1/auth/signup', user, code ? options : undefined);
    }

    login(user) {
        return this._$http.post('/api/v1/auth/login', user);
    }
}

export default PrincipalAPIService;

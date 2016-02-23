class SettingsAPIService {
    constructor($http) {
        'ngInject';

        this._$http = $http;
    }

    authProviders() {
        return this._$http.get('/api/v1/auth/providers')
            .then((x) => {
                const authProviders = x.data;

                if (authProviders.password && authProviders.password.regex) {
                    authProviders.password.regex = new RegExp(authProviders.password.regex);
                }

                return authProviders;
            });
    }
}

export default SettingsAPIService;
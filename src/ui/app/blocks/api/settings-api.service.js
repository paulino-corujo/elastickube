class SettingsAPIService {
    constructor($http, websocketClient) {
        'ngInject';

        this._$http = $http;
        this._websocketClient = websocketClient;
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

    unsubscribe() {
        return this._websocketClient.unSubscribeEvent('settings');
    }

    subscribe() {
        return this._websocketClient.subscribeEvent('settings');
    }

    update(settings) {
        return this._websocketClient.updateEvent('settings', settings);
    }
}

export default SettingsAPIService;

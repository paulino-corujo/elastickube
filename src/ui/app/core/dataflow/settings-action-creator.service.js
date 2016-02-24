class SettingsActionCreatorService {
    constructor($q, actions, dispatcher, settingsAPI) {
        'ngInject';

        this._$q = $q;
        this._actions = actions;
        this._dispatcher = dispatcher;
        this._settingsAPI = settingsAPI;
    }

    authProviders() {
        this._dispatcher.dispatch({
            type: this._actions.SETTINGS_AUTH_PROVIDERS_OBTAIN
        });

        return this._settingsAPI.authProviders();
    }

    subscribe() {
        this._dispatcher.dispatch({
            type: this._actions.SETTINGS_SUBSCRIBE
        });

        return this._settingsAPI.subscribe();
    }

    unsubscribe() {
        this._dispatcher.dispatch({
            type: this._actions.SETTINGS_UNSUBSCRIBE
        });

        return this._settingsAPI.unsubscribe();
    }

    update(settings) {
        this._dispatcher.dispatch({
            type: this._actions.SETTINGS_UPDATE,
            settings
        });

        return this._settingsAPI.update(settings);
    }
}

export default SettingsActionCreatorService;

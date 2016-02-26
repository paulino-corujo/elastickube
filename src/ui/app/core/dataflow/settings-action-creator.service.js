class SettingsActionCreatorService {
    constructor($q, actions, dispatcher, settingsAPI) {
        'ngInject';

        this._$q = $q;
        this._actions = actions;
        this._dispatcher = dispatcher;
        this._settingsAPI = settingsAPI;
    }

    authProviders(code) {
        this._dispatcher.dispatch({ type: this._actions.SETTINGS_AUTH_PROVIDERS_OBTAIN });

        return this._settingsAPI.authProviders(code);
    }

    subscribe() {
        this._dispatcher.dispatch({ type: this._actions.SETTINGS_SUBSCRIBE });

        return this._settingsAPI.subscribe()
            .then((settings) => this._dispatcher.dispatch({ type: this._actions.SETTINGS_SUBSCRIBED, settings }));
    }

    unsubscribe() {
        this._dispatcher.dispatch({ type: this._actions.SETTINGS_UNSUBSCRIBE });

        return this._settingsAPI.unsubscribe()
            .then(() => this._dispatcher.dispatch({ type: this._actions.SETTINGS_UNSUBSCRIBED }));
    }

    update(settings) {
        this._dispatcher.dispatch({ type: this._actions.SETTINGS_UPDATE, settings });

        return this._settingsAPI.update(settings)
            .then((updatedSettings) => this._dispatcher.dispatch({ type: this._actions.SETTINGS_UPDATE, settings: updatedSettings }));
    }
}

export default SettingsActionCreatorService;

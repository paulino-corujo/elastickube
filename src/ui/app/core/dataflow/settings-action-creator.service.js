class SettingsActionCreatorService {
    constructor(actions, dispatcher, settingsAPI) {
        'ngInject';

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
}

export default SettingsActionCreatorService;

/*
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

class SettingsActionCreatorService {
    constructor($q, actions, dispatcher, settingsAPI) {
        'ngInject';

        this._$q = $q;
        this._actions = actions;
        this._dispatcher = dispatcher;
        this._settingsAPI = settingsAPI;

        settingsAPI.addOnUpdatedListener((settings) => this._dispatcher.dispatch({ type: this._actions.SETTINGS_UPDATED, settings }));
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

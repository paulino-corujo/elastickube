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

import AbstractStore from './abstract-store';

const CHANGE_EVENT = 'change';

class SettingsStoreService extends AbstractStore {
    constructor($q, session, actions, dispatcher) {
        'ngInject';

        super(session);

        this._$q = $q;
        this._actions = actions;

        this.dispatchToken = dispatcher.register((action) => {
            switch (action.type) {

                case this._actions.SETTINGS_SUBSCRIBE:
                    this._isLoading = this._$q.defer();
                    break;

                case this._actions.SETTINGS_SUBSCRIBED:
                    this._setSettings(action.settings[0]);
                    this._isLoading.resolve();
                    this.emit(CHANGE_EVENT);
                    break;

                case this._actions.SETTINGS_UPDATE:
                case this._actions.SETTINGS_UPDATED:
                    this._setSettings(action.settings);
                    this.emit(CHANGE_EVENT);
                    break;

                default:
            }
        });
    }

    _setSettings(settings) {
        this._settings = settings;
    }

    getSettings() {
        return this._settings;
    }

    destroy() {
        delete this._settings;
        delete this._isLoading;
    }

    isLoading() {
        return this._isLoading.promise;
    }

    addSettingsChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeSettingsChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}

export default SettingsStoreService;

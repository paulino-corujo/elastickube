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

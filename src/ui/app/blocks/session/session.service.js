import { EventEmitter } from 'events';
import constants from 'constants';

const SESSION_DESTROYED_EVENT = 'session.destroyed';

class SessionService extends EventEmitter {
    constructor($cookies, $q, storage) {
        'ngInject';

        super();

        this.$cookies = $cookies;
        this._$q = $q;
        this._storage = storage;
        this._session = {};

        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);

            this._session[key] = JSON.parse(storage.getItem(key));
        }
    }

    getItem(key) {
        return this._session[key];
    }

    setItem(key, value) {
        this._session[key] = value;

        return this._$q.when(this._storage.setItem(key, JSON.stringify(value)));
    }

    removeItem(key) {
        delete this._session[key];
        this._storage.removeItem(key);
    }

    addSessionDestroyListener(callback) {
        this.on(SESSION_DESTROYED_EVENT, callback);
    }

    removeSessionDestroyListenerListener(callback) {
        this.removeListener(SESSION_DESTROYED_EVENT, callback);
    }

    destroy() {
        this.$cookies.remove(constants.SESSION_TOKEN_NAME);
        this._session = {};
        this._storage.clear();
        this.emit(SESSION_DESTROYED_EVENT);

        return this._$q.when();
    }
}

export default SessionService;

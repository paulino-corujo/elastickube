import { EventEmitter } from 'events';

const SESSION_DESTROYED_EVENT = 'session.destroyed';

class SessionService extends EventEmitter {
    constructor($q, storage) {
        'ngInject';

        super();

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
        this._session = {};
        this._storage.clear();
        this.emit(SESSION_DESTROYED_EVENT);

        return this._$q.when();
    }
}

export default SessionService;

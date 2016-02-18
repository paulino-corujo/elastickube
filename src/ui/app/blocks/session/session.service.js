class SessionService {
    constructor(storage) {
        'ngInject';

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
        this._storage.setItem(key, JSON.stringify(value));
    }

    removeItem(key) {
        delete this._session[key];
        this._storage.removeItem(key);
    }

    destroy() {
        this._session = {};
        this._storage.clear();
    }
}

export default SessionService;

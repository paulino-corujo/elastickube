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

            try {
                this._session[key] = JSON.parse(storage.getItem(key));
            } catch (error) {
                storage.removeItem(key);
            }
        }
    }

    getItem(key) {
        return this._session[key];
    }

    setItem(key, value) {
        this._session[key] = value;

        return this._$q.when(!_.isUndefined(value) && this._storage.setItem(key, JSON.stringify(value)));
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

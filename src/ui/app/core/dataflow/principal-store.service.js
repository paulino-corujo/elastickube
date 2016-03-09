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

class UserStoreService extends AbstractStore {
    constructor(session, actions, dispatcher) {
        'ngInject';

        super(session);

        this._actions = actions;

        this.dispatchToken = dispatcher.register((action) => {
            switch (action.type) {
                case this._actions.PRINCIPAL_LOGGED:
                    this._principal = action.principal;
                    this.emit(CHANGE_EVENT);
                    break;

                case this._actions.SESSION_DESTROYED:
                case this._actions.PRINCIPAL_LOGOUT:
                    delete this._principal;
                    this.emit(CHANGE_EVENT);
                    break;

                case this._actions.PRINCIPAL_UPDATE:
                case this._actions.PRINCIPAL_UPDATED:
                    this._principal = action.principal;
                    this.emit(CHANGE_EVENT);
                    break;

                default:
            }
        });
    }

    destroy() {
        delete this._principal;
    }

    getPrincipal() {
        return this._principal;
    }

    isAdmin() {
        return _.get(this._principal, 'role') === 'administrator';
    }

    addPrincipalChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removePrincipalChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}

export default UserStoreService;

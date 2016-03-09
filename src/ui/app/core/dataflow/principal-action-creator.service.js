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

class PrincipalActionCreatorService {

    constructor($q, actions, dispatcher, principalAPI, usersStore) {
        'ngInject';

        this._$q = $q;
        this._actions = actions;
        this._principalAPI = principalAPI;
        this._dispatcher = dispatcher;
        this._userStore = usersStore;
    }

    signup(user, code) {
        this._dispatcher.dispatch({ type: this._actions.PRINCIPAL_SIGN_UP });

        return this._principalAPI.signup(user, code);
    }

    login(user) {
        this._dispatcher.dispatch({ type: this._actions.PRINCIPAL_LOGIN });

        return this._principalAPI.login(user);
    }

    loggedIn(username) {
        this._dispatcher.dispatch({
            type: this._actions.PRINCIPAL_LOGGED,
            principal: this._userStore.get(username)
        });
    }

    logout() {
        return this._$q.when(this._dispatcher.dispatch({ type: this._actions.PRINCIPAL_LOGOUT }));
    }
}

export default PrincipalActionCreatorService;

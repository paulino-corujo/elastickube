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

import constants from './constants';

class SessionActionCreatorService {
    constructor($q, actions, dispatcher, instancesAPI, namespacesStore, session) {
        'ngInject';

        this._$q = $q;

        this._actions = actions;
        this._dispatcher = dispatcher;
        this._instancesAPI = instancesAPI;
        this._namespacesStore = namespacesStore;
        this._session = session;
    }

    storeSessionToken(sessionToken) {
        this._dispatcher.dispatch({ type: this._actions.SESSION_TOKEN_STORE, sessionToken });

        return this._session.setItem(constants.SESSION_TOKEN, sessionToken)
            .then(() => this._dispatcher.dispatch({ type: this._actions.SESSION_TOKEN_STORED }));
    }

    selectNamespace(namespace) {
        const oldNamespaceUID = this._session.getItem(constants.ACTIVE_NAMESPACE);

        this._dispatcher.dispatch({ type: this._actions.SESSION_NAMESPACE_CHANGE, namespace });

        return this._session.setItem(constants.ACTIVE_NAMESPACE, namespace.metadata.uid)
            .then(() => {
                let oldNamespace;

                this._dispatcher.dispatch({ type: this._actions.SESSION_NAMESPACE_CHANGED, namespace });
                return this._$q.when(!_.isUndefined(oldNamespaceUID)
                    && (oldNamespace = this._namespacesStore.get(oldNamespaceUID)) && this._unsubscribeNamespace(oldNamespace));
            })
            .then(() => {
                this._dispatcher.dispatch({ type: this._actions.INSTANCES_SUBSCRIBE, namespace });

                return this._instancesAPI.subscribe({ namespace: namespace.metadata.name })
                    .then((x) => this._dispatcher.dispatch({ type: this._actions.INSTANCES_SUBSCRIBED, namespace, instances: x }));
            });
    }

    _unsubscribeNamespace(oldNamespace) {
        this._dispatcher.dispatch({
            type: this._actions.INSTANCES_UNSUBSCRIBE,
            namespace: oldNamespace
        });

        return this._$q.when(angular.isDefined(oldNamespace)
                && this._instancesAPI.unsubscribe({ namespace: oldNamespace.metadata.name }))
            .then((x) => this._dispatcher.dispatch({
                type: this._actions.INSTANCES_UNSUBSCRIBED,
                namespace: this._namespacesStore.get(x)
            }));
    }

    saveInstancesStatus(namespaceInstancesStatus) {
        const namespaceUID = this._session.getItem(constants.ACTIVE_NAMESPACE);
        const namespace = this._namespacesStore.get(namespaceUID);

        this._dispatcher.dispatch({ type: this._actions.SESSION_INSTANCES_STATUS_CHANGE, namespace, namespaceInstancesStatus });

        const instancesStatus = this._session.getItem(constants.INSTANCES_STATUS) || {};

        instancesStatus[namespaceUID] = namespaceInstancesStatus;

        return this._session.setItem(constants.INSTANCES_STATUS, instancesStatus)
            .then(() => this._dispatcher.dispatch({
                namespace,
                instancesStatus: namespaceInstancesStatus,
                type: this._actions.SESSION_INSTANCES_STATUS_CHANGED
            }));
    }

    saveAdminInstancesStatus(adminInstancesStatus) {
        this._dispatcher.dispatch({ type: this._actions.SESSION_ADMIN_INSTANCES_STATUS_CHANGE, adminInstancesStatus });

        return this._session.setItem(constants.ADMIN_INSTANCES_STATUS, adminInstancesStatus)
            .then(() => this._dispatcher.dispatch({ type: this._actions.SESSION_ADMIN_INSTANCES_STATUS_CHANGED, adminInstancesStatus }));
    }

    destroy() {
        this._dispatcher.dispatch({ type: this._actions.SESSION_DESTROY });

        return this._session.destroy()
            .then(() => this._dispatcher.dispatch({ type: this._actions.SESSION_DESTROYED }));
    }
}

export default SessionActionCreatorService;

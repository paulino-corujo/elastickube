import constants from './constants';

class SessionActionCreatorService {
    constructor(actions, dispatcher, instancesAPI, namespacesStore, session) {
        'ngInject';

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
                this._dispatcher.dispatch({ type: this._actions.SESSION_NAMESPACE_CHANGED, namespace });

                if (!_.isUndefined(oldNamespaceUID)) {
                    const oldNamespace = this._namespacesStore.get(oldNamespaceUID);

                    this._dispatcher.dispatch({
                        type: this._actions.INSTANCES_UNSUBSCRIBE,
                        namespace: oldNamespace
                    });

                    return this._instancesAPI.unsubscribe({ namespace: oldNamespace.metadata.name })
                        .then((x) => this._dispatcher.dispatch({
                            type: this._actions.INSTANCES_UNSUBSCRIBED,
                            namespace: this._namespacesStore.get(x)
                        }));
                }
            })
            .then(() => {
                this._dispatcher.dispatch({ type: this._actions.INSTANCES_SUBSCRIBE, namespace });

                return this._instancesAPI.subscribe({ namespace: namespace.metadata.name })
                    .then((x) => this._dispatcher.dispatch({ type: this._actions.INSTANCES_SUBSCRIBED, namespace, instances: x }));
            });
    }

    saveCollapsedInstancesState(collapsedInstances) {
        this._dispatcher.dispatch({ type: this._actions.SESSION_EXPANDED_INSTANCES_CHANGE, collapsedInstances });

        return this._session.setItem(constants.EXPANDED_INSTANCES, collapsedInstances)
            .then(() => this._dispatcher.dispatch({ type: this._actions.SESSION_EXPANDED_INSTANCES_CHANGED, collapsedInstances }));
    }

    saveCollapsedAdminInstancesState(collapsedInstances) {
        this._dispatcher.dispatch({ type: this._actions.SESSION_EXPANDED_ADMIN_INSTANCES_CHANGE, collapsedInstances });

        return this._session.setItem(constants.EXPANDED_ADMIN_INSTANCES, collapsedInstances)
            .then(() => this._dispatcher.dispatch({ type: this._actions.SESSION_EXPANDED_ADMIN_INSTANCES_CHANGED, collapsedInstances }));
    }

    destroy() {
        this._dispatcher.dispatch({ type: this._actions.SESSION_DESTROY });

        return this._session.destroy()
            .then(() => this._dispatcher.dispatch({ type: this._actions.SESSION_DESTROYED }));
    }
}

export default SessionActionCreatorService;

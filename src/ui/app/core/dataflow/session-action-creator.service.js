import constants from './constants';

class SessionActionCreatorService {
    constructor(actions, dispatcher, session, instancesAPI) {
        'ngInject';

        this._actions = actions;
        this._dispatcher = dispatcher;
        this._instancesAPI = instancesAPI;
        this._session = session;
    }

    storeSessionToken(sessionToken) {
        this._dispatcher.dispatch({
            type: this._actions.SESSION_TOKEN_STORE,
            sessionToken
        });

        return this._session.setItem(constants.SESSION_TOKEN, sessionToken)
            .then(() => {
                this._dispatcher.dispatch({
                    type: this._actions.SESSION_TOKEN_STORED
                });
            });
    }

    selectNamespace(namespace) {
        this._dispatcher.dispatch({
            type: this._actions.NAMESPACE_CHANGE,
            namespace
        });

        return this._session.setItem(constants.ACTIVE_NAMESPACE, namespace.metadata.uid)
            .then(() => {
                this._dispatcher.dispatch({
                    type: this._actions.NAMESPACE_CHANGED
                });
                return this._instancesAPI.unsubscribe();
            })
            .then(() => {
                return this._instancesAPI.subscribe(namespace.metadata.name);
            });
    }

    destroy() {
        this._dispatcher.dispatch({
            type: this._actions.SESSION_DESTROY
        });

        return this._session.destroy()
            .then(() => {
                this._dispatcher.dispatch({
                    type: this._actions.SESSION_DESTROYED
                });
            });
    }
}

export default SessionActionCreatorService;

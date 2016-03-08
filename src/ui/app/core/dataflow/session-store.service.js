import AbstractStore from './abstract-store';
import constants from './constants';

const NAMESPACE_UPDATED_EVENT = 'namespace.change';
const EXPANDED_INSTANCES_CHANGED_EVENT = 'expanded-instances.changed';
const EXPANDED_ADMIN_INSTANCES_CHANGED_EVENT = 'expanded-admin-instances.changed';

class SessionStoreService extends AbstractStore {
    constructor(session, actions, dispatcher, namespacesStore) {
        'ngInject';

        super(session);

        this._actions = actions;
        this._session = session;
        this._namespacesStore = namespacesStore;

        this.dispatchToken = dispatcher.register((action) => {
            switch (action.type) {

                case this._actions.SESSION_NAMESPACE_CHANGED:
                    this.emit(NAMESPACE_UPDATED_EVENT);
                    break;

                case this._actions.SESSION_EXPANDED_INSTANCES_CHANGED:
                    this.emit(EXPANDED_INSTANCES_CHANGED_EVENT);
                    break;

                case this._actions.SESSION_EXPANDED_ADMIN_INSTANCES_CHANGED:
                    this.emit(EXPANDED_ADMIN_INSTANCES_CHANGED_EVENT);
                    break;

                default:
            }
        });
    }

    getActiveNamespace() {
        const namespaceUID = this._session.getItem(constants.ACTIVE_NAMESPACE);

        return _.find(this._namespacesStore.getAll(), (x) => x.metadata.uid === namespaceUID);
    }

    getSessionToken() {
        return this._session.getItem(constants.SESSION_TOKEN);
    }

    getExpandedInstances() {
        const namespaceUID = this._session.getItem(constants.ACTIVE_NAMESPACE);
        const expandedInstances = this._session.getItem(constants.EXPANDED_INSTANCES) || {};

        return expandedInstances[namespaceUID];
    }

    getExpandedAdminInstances() {
        return this._session.getItem(constants.EXPANDED_ADMIN_INSTANCES);
    }

    addNamespaceChangeListener(callback) {
        this.on(NAMESPACE_UPDATED_EVENT, callback);
    }

    removeNamespaceChangeListener(callback) {
        this.removeListener(NAMESPACE_UPDATED_EVENT, callback);
    }

    addExpandedInstancesChangeListener(callback) {
        this.on(EXPANDED_INSTANCES_CHANGED_EVENT, callback);
    }

    removeExpandedInstancesChangeListener(callback) {
        this.removeListener(EXPANDED_INSTANCES_CHANGED_EVENT, callback);
    }

    addExpandedAdminInstancesChangeListener(callback) {
        this.on(EXPANDED_ADMIN_INSTANCES_CHANGED_EVENT, callback);
    }

    removeExpandedAdminInstancesChangeListener(callback) {
        this.removeListener(EXPANDED_ADMIN_INSTANCES_CHANGED_EVENT, callback);
    }
}

export default SessionStoreService;

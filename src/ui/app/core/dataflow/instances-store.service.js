import AbstractStore from './abstract-store';

const CHANGE_EVENT = 'change';

class InstancesStoreService extends AbstractStore {
    constructor($q, session, actions, dispatcher) {
        'ngInject';

        super(session);

        this._$q = $q;
        this._actions = actions;
        this._instances = {};

        this.dispatchToken = dispatcher.register((action) => {
            switch (action.type) {
                case this._actions.NAMESPACE_CHANGED:
                    this._isLoading = this._$q.defer();
                    break;

                case this._actions.INSTANCES_SUBSCRIBED:
                    this._setInstances(action.instances);
                    this._isLoading.resolve();
                    this.emit(CHANGE_EVENT);
                    break;

                case this._actions.INSTANCES_UNSUBSCRIBED:
                    this._removeInstances(action.namespace);
                    this.emit(CHANGE_EVENT);
                    break;

                case this._actions.INSTANCES_UPDATED:
                    this._setInstance(action.instance);
                    this.emit(CHANGE_EVENT);
                    break;

                default:
            }
        });
    }

    _setInstance(instance) {
        this._instances[instance.metadata.uid] = instance;
    }

    _setInstances(instances) {
        _.each(instances, (x) => this._setInstance(x));
    }

    _removeInstances(namespace) {
        if (_.isUndefined(namespace)) {
            return;
        }

        const instances = _.reject(_.values(this._instances), (x) => x.metadata.namespace === namespace.metadata.name);

        this.destroy();
        this._setInstances(instances);
    }

    isLoading() {
        return this._isLoading.promise;
    }

    destroy() {
        this._instances = {};
    }

    get(uid) {
        return this._instances[uid];
    }

    getAll(namespace) {
        const instances = _.values(this._instances);

        return namespace ? _.filter(instances, (x) => x.metadata.namespace === namespace) : instances;
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}

export default InstancesStoreService;

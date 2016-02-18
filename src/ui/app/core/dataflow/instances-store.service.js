import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

class InstancesStoreService extends EventEmitter {
    constructor($q, actions, dispatcher) {
        'ngInject';

        super();

        this._$q = $q;
        this._actions = actions;

        this.dispatchToken = dispatcher.register((action) => {
            switch (action.type) {
                case this._actions.NAMESPACE_CHANGED:
                case this._actions.INSTANCES_LOAD:
                    this._isLoading = this._$q.defer();
                    break;

                case this._actions.INSTANCES_LOADED:
                    this._setInstances(action.instances);
                    this._isLoading.resolve();
                    this.emit(CHANGE_EVENT);
                    break;

                default:
            }
        });
    }

    _setInstances(instances) {
        this._instances = instances;
    }

    isLoading() {
        return this._isLoading.promise;
    }

    get(id) {
        return _.find(this._instances, { id });
    }

    getAll() {
        return this._instances;
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}

export default InstancesStoreService;

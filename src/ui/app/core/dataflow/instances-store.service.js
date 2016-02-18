import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

class InstancesStoreService extends EventEmitter {
    constructor($q, actions, dispatcher) {
        'ngInject';

        super();

        this._$q = $q;
        this._actions = actions;
        this._loading = this._$q.defer();

        this.dispatchToken = dispatcher.register((action) => {
            switch (action.type) {

                case this._actions.api.INSTANCES_PRELOADED:
                    this._loading.resolve();
                    this._setInstances(action.instances);
                    this.emit(CHANGE_EVENT);
                    break;

                case this._actions.api.INSTANCES_LOADED:
                    this._setInstances(action.instances);
                    this.emit(CHANGE_EVENT);
                    break;

                default:
            }
        });
    }

    _setInstances(instances) {
        this._instances = instances;
    }

    loading() {
        return this._loading.promise;
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

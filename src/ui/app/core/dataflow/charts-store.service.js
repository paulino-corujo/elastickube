import AbstractStore from './abstract-store';

const CHANGE_EVENT = 'change';

class ChartStoreService extends AbstractStore {
    constructor($q, session, actions, dispatcher) {
        'ngInject';

        super(session);

        this._$q = $q;
        this._actions = actions;

        this.dispatchToken = dispatcher.register((action) => {
            switch (action.type) {
                case this._actions.CHARTS_SUBSCRIBE:
                    this._isLoading = this._$q.defer();
                    break;

                case this._actions.CHARTS_SUBSCRIBED:
                    this._setCharts(action.charts);
                    this._isLoading.resolve();
                    this.emit(CHANGE_EVENT);
                    break;

                case this._actions.CHARTS_UPDATED:
                    this.emit(CHANGE_EVENT);
                    break;

                default:
            }
        });
    }

    _setCharts(charts) {
        this._charts = charts;
    }

    isLoading() {
        return this._isLoading.promise;
    }

    destroy() {
        delete this._charts;
    }

    get(id) {
        return _.find(this._charts, { id });
    }

    getAll() {
        return this._charts;
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}

export default ChartStoreService;

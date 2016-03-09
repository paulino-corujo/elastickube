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

class ChartStoreService extends AbstractStore {
    constructor($q, session, actions, dispatcher) {
        'ngInject';

        super(session);

        this._$q = $q;
        this._actions = actions;
        this._charts = {};

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

                case this._actions.CHARTS_CREATED:
                case this._actions.CHARTS_UPDATED:
                    this._setChart(action.chart);
                    this.emit(CHANGE_EVENT);
                    break;

                case this._actions.CHARTS_DELETED:
                    this._removeChart(action.chart);
                    this.emit(CHANGE_EVENT);
                    break;

                default:
            }
        });
    }

    _setChart(chart) {
        this._charts[_.get(chart, '_id.$oid')] = chart;
    }

    _setCharts(charts) {
        this._charts = {};

        charts.forEach((x) => this._setChart(x));
    }

    _removeChart(chart) {
        delete this._charts[_.get(chart, '_id.$oid')];
    }

    isLoading() {
        return this._isLoading.promise;
    }

    destroy() {
        this._charts = {};
        delete this._isLoading;
    }

    get(id) {
        return _.find(this._charts, _.matchesProperty('_id.$oid', id));
    }

    getAll() {
        return _.values(this._charts);
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}

export default ChartStoreService;

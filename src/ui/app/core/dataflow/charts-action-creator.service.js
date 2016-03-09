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

class ChartsActionCreatorService {
    constructor(actions, chartsAPI, dispatcher) {
        'ngInject';

        this._actions = actions;
        this._chartsAPI = chartsAPI;
        this._dispatcher = dispatcher;

        chartsAPI.addOnCreatedListener((chart) => this._dispatcher.dispatch({ type: this._actions.CHARTS_CREATED, chart }));
        chartsAPI.addOnUpdatedListener((chart) => this._dispatcher.dispatch({ type: this._actions.CHARTS_UPDATED, chart }));
        chartsAPI.addOnDeletedListener((chart) => this._dispatcher.dispatch({ type: this._actions.CHARTS_DELETED, chart }));
    }

    subscribe() {
        this._dispatcher.dispatch({ type: this._actions.CHARTS_SUBSCRIBE });

        return this._chartsAPI.subscribe()
            .then((charts) => this._dispatcher.dispatch({ type: this._actions.CHARTS_SUBSCRIBED, charts }));
    }
}

export default ChartsActionCreatorService;

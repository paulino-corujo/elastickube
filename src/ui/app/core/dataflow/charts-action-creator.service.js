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

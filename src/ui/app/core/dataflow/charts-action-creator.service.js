class ChartsActionCreatorService {
    constructor(actions, chartsAPI, dispatcher) {
        'ngInject';

        this._actions = actions;
        this._chartsAPI = chartsAPI;
        this._dispatcher = dispatcher;
    }

    subscribe() {
        this._dispatcher.dispatch({ type: this._actions.CHARTS_SUBSCRIBE });

        return this._chartsAPI.subscribe()
            .then((charts) => this._dispatcher.dispatch({ type: this._actions.CHARTS_SUBSCRIBED, charts }));
    }
}

export default ChartsActionCreatorService;

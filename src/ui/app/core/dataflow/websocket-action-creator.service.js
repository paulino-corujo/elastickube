class WebsocketActionCreatorService {
    constructor(actions, dispatcher) {
        'ngInject';

        this._actions = actions;
        this._dispatcher = dispatcher;
    }

    instancesSubscribed(instances) {
        this._dispatcher.dispatch({
            type: this._actions.INSTANCES_SUBSCRIBED,
            instances
        });
    }

    updateInstances(instance) {
        this._dispatcher.dispatch({
            type: this._actions.INSTANCES_UPDATE,
            instance
        });
    }

}

export default WebsocketActionCreatorService;

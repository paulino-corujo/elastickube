class WebsocketActionCreatorService {
    constructor(actions, dispatcher) {
        'ngInject';

        this._actions = actions;
        this._dispatcher = dispatcher;
    }

    subscribedResource(message) {
        const event = {};
        let eventName;

        switch (message.action) {

            case this._actions.INSTANCES:
                eventName = this._actions.INSTANCES_SUBSCRIBED;
                break;

            case this._actions.NAMESPACES:
                eventName = this._actions.NAMESPACES_SUBSCRIBED;
                break;

            default:
        }

        event.type = eventName;
        event[message.action] = message.body;

        this._dispatcher.dispatch(event);
    }

    updateResource(message) {
        const event = {};
        let eventName;

        switch (message.action) {

            case this._actions.INSTANCES:
                eventName = this._actions.INSTANCES_UPDATED;
                break;

            case this._actions.NAMESPACES:
                eventName = this._actions.NAMESPACES_UPDATED;
                break;

            default:
        }

        event.type = eventName;
        event[message.action] = message.action;

        this._dispatcher.dispatch(event);
    }
}

export default WebsocketActionCreatorService;

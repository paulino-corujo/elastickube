import constants from 'constants';

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

            case constants.CHARTS:
                eventName = this._actions.CHARTS_SUBSCRIBED;
                break;

            case constants.INSTANCES:
                eventName = this._actions.INSTANCES_SUBSCRIBED;
                break;

            case constants.NAMESPACES:
                eventName = this._actions.NAMESPACES_SUBSCRIBED;
                break;

            case constants.USERS:
                eventName = this._actions.USERS_SUBSCRIBED;
                break;

            case constants.SETTINGS:
                eventName = this._actions.SETTINGS_SUBSCRIBED;
                break;

            default:
        }

        event.type = eventName;
        event[message.action] = message.body;

        this._dispatcher.dispatch(event);
    }

    unSubscribedResource(message) {
        const event = {};
        let eventName;

        switch (message.action) {

            case constants.CHARTS:
                eventName = this._actions.INSTANCES_UNSUBSCRIBED;
                break;

            case constants.INSTANCES:
                eventName = this._actions.INSTANCES_UNSUBSCRIBED;
                break;

            case constants.NAMESPACES:
                eventName = this._actions.NAMESPACES_UNSUBSCRIBED;
                break;

            case constants.USERS:
                eventName = this._actions.USERS_UNSUBSCRIBED;
                break;

            case constants.SETTINGS:
                eventName = this._actions.SETTINGS_UNSUBSCRIBED;
                break;

            default:
        }

        event.type = eventName;

        this._dispatcher.dispatch(event);
    }

    updateResource(message) {
        const event = {};
        let eventName;

        switch (message.action) {

            case constants.CHARTS:
                eventName = this._actions.CHARTS_UPDATED;
                break;

            case constants.INSTANCES:
                eventName = this._actions.INSTANCES_UPDATED;
                break;

            case constants.NAMESPACES:
                eventName = this._actions.NAMESPACES_UPDATED;
                break;

            case constants.USERS:
                eventName = this._actions.USERS_UPDATED;
                break;

            case constants.SETTINGS:
                eventName = this._actions.SETTINGS_UPDATED;
                break;

            default:
        }

        event.type = eventName;
        event.operation = message.operation;
        event[message.action] = message.body;

        this._dispatcher.dispatch(event);
    }
}

export default WebsocketActionCreatorService;

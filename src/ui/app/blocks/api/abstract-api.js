import { EventEmitter } from 'events';

const events = {
    UPDATED: 'UPDATED',
    CREATED: 'CREATED',
    DELETED: 'DELETED',
    SUBSCRIBED: 'SUBSCRIBED',
    UNSUBSCRIBED: 'UNSUBSCRIBED'
};

class AbstractAPI extends EventEmitter {

    constructor(name, ws) {
        super();

        if (this.constructor.name === 'AbstractAPI') {
            throw new Error('This class cannot be instantiated.');
        }

        this._name = name;
        this._ws = ws;

        this._ws.addEventListener((message) => {
            if (this._name === message.action) {
                switch (message.operation) {

                    case 'updated':
                        this.emit(events.UPDATED, message.body);
                        break;

                    case 'created':
                        this.emit(events.CREATED, message.body);
                        break;

                    case 'deleted':
                        this.emit(events.DELETED, message.body);
                        break;

                    case 'watched':
                        this.emit(events.SUBSCRIBED, message.body);
                        break;

                    case 'unwatched':
                        this.emit(events.UNSUBSCRIBED, message.body);
                        break;

                    default:
                        throw Error('Unknown message type ' + JSON.stringify(message));
                }
            }
        });
    }

    subscribe(body) {
        return this._ws.subscribeEvent(this._name, body)
            .then((x) => x && x.body);
    }

    unsubscribe(body) {
        return this._ws.unsubscribeEvent(this._name, body);
    }

    update(body) {
        return this._ws.updateEvent(this._name, body)
            .then((x) => x && x.body);
    }

    remove(body) {
        return this._ws.deleteEvent(this._name, body);
    }

    create(body) {
        return this._ws.createEvent(this._name, body)
            .then((x) => x && x.body);
    }

    addOnUpdatedListener(callback) {
        this.on(events.UPDATED, callback);
    }

    removeOnUpdatedListener(callback) {
        this.removeListener(events.UPDATED, callback);
    }

    addOnCreatedListener(callback) {
        this.on(events.CREATED, callback);
    }

    removeOnCreatedListener(callback) {
        this.removeListener(events.CREATED, callback);
    }

    addOnDeletedListener(callback) {
        this.on(events.DELETED, callback);
    }

    removeOnDeletedListener(callback) {
        this.removeListener(events.DELETED, callback);
    }

    addOnSubscribedListener(callback) {
        this.on(events.SUBSCRIBED, callback);
    }

    removeOnSubscribedListener(callback) {
        this.removeListener(events.SUBSCRIBED, callback);
    }

    addOnUnsubscribedListener(callback) {
        this.on(events.UNSUBSCRIBED, callback);
    }

    removeOnUnsubscribedListener(callback) {
        this.removeListener(events.UNSUBSCRIBED, callback);
    }
}

export default AbstractAPI;

import { EventEmitter } from 'events';

const EVENT = 'EVENT';

class WebsocketClientService extends EventEmitter {

    constructor($q, $rootScope) {
        'ngInject';

        super();

        this._$q = $q;
        this._$rootScope = $rootScope;

        this._connectionAttempts = 1;
        this._eventsSubscribed = {};
        this._currentOnGoingMessages = {};
    }

    connect() {
        const defer = this._$q.defer();

        if (_.isUndefined(this._websocket) || this._websocket.readyState === WebSocket.CLOSED) {
            this._websocket = new WebSocket(`ws://${location.hostname}/api/v1/ws`);

            this._websocket.onopen = () => {
                const watcherPromises = [];

                this._connectionAttempts = 1;
                this._reconnect = true;

                _.each(this._eventsSubscribed, (watcher) =>
                    watcherPromises.push(this.sendMessage(watcher)
                        .then((response) => this.emit(EVENT, response))));

                this._$q.all(watcherPromises)
                    .then(() => defer.resolve());
            };

            this._websocket.onmessage = (evt) => {
                const message = JSON.parse(evt.data);

                this._$rootScope.$apply(() => {
                    if (message.correlation) {
                        if (message.status_code >= 400) {
                            this._currentOnGoingMessages[message.correlation].reject(message);
                        } else {
                            this._currentOnGoingMessages[message.correlation].resolve(message);
                        }

                        delete this._currentOnGoingMessages[message.correlation];
                    } else {
                        this.emit(EVENT, message);
                    }
                });
            };

            this._websocket.onerror = () => defer.reject();

            this._websocket.onclose = () => {
                if (this._reconnect) {
                    const time = generateInterval(this._connectionAttempts);

                    setTimeout(() => {
                        this._connectionAttempts++;
                        this.connect();
                    }, time);
                }
            };
        } else {
            defer.resolve();
        }

        return defer.promise;
    }

    disconnect() {
        const promises = [];

        _.each(this._eventsSubscribed, (value, key) => promises.push(this.unsubscribeEvent(key)));

        return this._$q.all(promises)
            .then(() => {
                this._reconnect = false;
                this._websocket.close();
            });
    }

    sendMessage(message) {
        if (this._websocket.readyState !== WebSocket.OPEN) {
            return this._$q.reject('Not Connected');
        }

        const defer = this._$q.defer();
        const correlationId = _.uniqueId();

        this._currentOnGoingMessages[correlationId] = defer;

        message.correlation = correlationId;
        this._websocket.send(JSON.stringify(message));

        return defer.promise;
    }

    subscribeEvent(action, body) {
        const message = {
            action,
            body,
            operation: 'watch'
        };

        return this.sendMessage(message)
            .then((response) => {
                this._eventsSubscribed[action] = message;

                return response;
            });
    }

    unsubscribeEvent(action, body) {
        const message = {
            action,
            body,
            operation: 'unwatch'
        };

        return this._$q.when(this._eventsSubscribed[action] && this.sendMessage(message)
                .then(() => delete this._eventsSubscribed[action]));
    }

    updateEvent(action, body) {
        const message = {
            action,
            body,
            operation: 'update'
        };

        return this._$q.when(this.sendMessage(message));
    }

    deleteEvent(action, body) {
        const message = {
            action,
            body,
            operation: 'delete'
        };

        return this._$q.when(this.sendMessage(message));
    }

    createEvent(action, body) {
        const message = {
            action,
            body,
            operation: 'create'
        };

        return this._$q.when(this.sendMessage(message));
    }

    addEventListener(callback) {
        this.on(EVENT, callback);
    }

    removeEventListener(callback) {
        this.removeListener(EVENT, callback);
    }
}

function generateInterval(k) {
    return Math.min(30, Math.pow(2, k) - 1) * 1000;
}

export default WebsocketClientService;

class WebsocketClientService {

    constructor($q, $rootScope, websocketActionCreator) {
        'ngInject';

        this._$q = $q;
        this._$rootScope = $rootScope;
        this._websocketActionCreator = websocketActionCreator;

        this._connectionAttempts = 1;
        this._eventsSubscribed = new Set();
        this._currentOnGoingMessages = {};
    }

    connect() {
        const defer = this._$q.defer();

        if (_.isUndefined(this._websocket) || this._websocket.readyState === WebSocket.CLOSED) {
            this._websocket = new WebSocket(`ws://${location.hostname}/api/v1/ws`);

            this._websocket.onopen = () => {
                this._connectionAttempts = 1;
                this._reconnect = true;
                defer.resolve();
            };

            this._websocket.onmessage = (evt) => {
                const message = JSON.parse(evt.data);

                if (message.correlation) {
                    this._$rootScope.$apply(() => {
                        if (message.status_code >= 400) {
                            this._currentOnGoingMessages[message.correlation].reject(message);
                        } else {
                            this._currentOnGoingMessages[message.correlation].resolve(message);
                        }
                        delete this._currentOnGoingMessages[message.correlation];
                    });
                } else {
                    this._websocketActionCreator.updateResource(message);
                }
            };

            this._websocket.onerror = () => {
                defer.reject();
            };

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

        this._eventsSubscribed.forEach((value) => promises.push(this.unSubscribeEvent(value)));

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

    subscribeEvent(action, namespace) {
        const message = {
            action,
            operation: 'watch'
        };

        if (!_.isUndefined(namespace)) {
            message.namespace = namespace;
        }

        return this.sendMessage(message)
            .then((response) => {
                this._eventsSubscribed.add(action);
                this._websocketActionCreator.subscribedResource(response);
            });
    }

    unSubscribeEvent(action) {
        const message = {
            action,
            operation: 'unwatch'
        };

        return this._$q.when(this._eventsSubscribed.has(action) && this.sendMessage(message)
                .then((response) => {
                    this._eventsSubscribed.delete(action);
                    this._websocketActionCreator.unSubscribedResource(response);
                }));
    }
}

function generateInterval(k) {
    return Math.min(30, Math.pow(2, k) - 1) * 1000;
}

export default WebsocketClientService;

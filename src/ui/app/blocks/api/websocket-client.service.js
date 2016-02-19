class WebsocketClientService {

    constructor($q, $rootScope, websocketActionCreator) {
        'ngInject';

        this._$q = $q;
        this._$rootScope = $rootScope;
        this._connectionAttempts = 1;
        this._websocketActionCreator = websocketActionCreator;
        this._eventsSubscribed = new Set();
        this._currentOnGoingMessages = {};
    }

    connect() {
        const defer = this._$q.defer();

        if (_.isUndefined(this._websocket) || this._websocket.readyState === WebSocket.CLOSED) {
            this._websocket = new WebSocket(`ws://${location.hostname}/api/v1/ws`);

            this._websocket.onopen = () => {
                this._connectionAttempts = 1;
                defer.resolve();
            };

            this._websocket.onmessage = (evt) => {
                const message = JSON.parse(evt.data);

                if (message.correlation) {
                    this._$rootScope.$apply(() => {
                        this._currentOnGoingMessages[message.correlation].resolve(message.body);
                        delete this._currentOnGoingMessages[message.correlation];
                    });
                } else {
                    this._websocketActionCreator.updateInstances(message);
                }
            };

            this._websocket.onerror = () => {
                defer.reject();
            };

            this._websocket.onclose = () => {
                const time = generateInterval(this._connectionAttempts);

                setTimeout(() => {
                    this._connectionAttempts++;
                    this.connect();
                }, time);
            };
        }
        return defer.promise;
    }

    disconnect() {
        this._websocket.close();
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
            namespace,
            operation: 'watch'
        };

        return this.sendMessage(message)
            .then((data) => {
                this._$q.when(this._eventsSubscribed.add(action));
                this._websocketActionCreator.instancesSubscribed(data);
            });
    }

    unsubscribeEvent(eventName) {
        return this.sendMessage(eventName)
            .then(() => this._eventsSubscribed.delete(eventName));
    }
}

function generateInterval(k) {
    return Math.min(30, Math.pow(2, k) - 1) * 1000;
}

export default WebsocketClientService;

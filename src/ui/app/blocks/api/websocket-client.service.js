// TODO Pending of refactoring
class WebsocketClientService {

    constructor($q, $rootScope) {
        'ngInject';

        this._$q = $q;

        this.$rootScope = $rootScope;
        this.connectionAttempts = 1;
        this.eventMessageListeners = [];
        this.eventsSubscribed = new Set();
        this.currentOnGoingMessages = {};
    }

    connect() {
        if (_.isUndefined(this.websocket) || this.websocket.readyState === WebSocket.CLOSED) {
            this.websocket = new WebSocket(`ws://${location.hostname}/api/v1/websockets`);

            this.websocket.onopen = () => {
                this.connectionAttempts = 1;
                this.eventsSubscribed.forEach((x) => this.subscribeEvent(x));
            };

            this.websocket.onmessage = (evt) => {
                const message = JSON.parse(evt);

                if (message.callbackId) {
                    this.$rootScope.$apply(() => {
                        this.currentOnGoingMessages[message.callbackId].resolve(message.data);
                        delete this.currentOnGoingMessages[message.callbackId];
                    });
                } else {
                    this.eventMessageListeners.forEach((eventMessageListener) => {
                        this.$rootScope.$apply(() => eventMessageListener.notifyMessage(message.data));
                    });
                }
            };

            this.websocket.onclose = () => {
                const time = generateInterval(this.connectionAttempts);

                setTimeout(() => {
                    this.connectionAttempts++;
                    this.connect();
                }, time);
            };
        }
    }

    sendMessage(message) {
        if (this.websocket.readyState === WebSocket.OPEN) {
            return this.$q.reject('Not Connected');
        }

        const defer = this.$q.defer();
        const callbackId = _.uniqueId();

        this.currentOnGoingMessages[callbackId] = defer;

        message.callbackId = callbackId;
        this.websocket.send(JSON.stringify(message));

        return defer.promise;
    }

    subscribeEvent(eventName) {
        this.sendMessage(eventName);
        this.eventsSubscribed.add(eventName);
    }

    unsubscribeEvent(eventName) {
        this.sendMessage(eventName);
        this.eventsSubscribed.delete(eventName);
    }
}

function generateInterval(k) {
    return Math.min(30, Math.pow(2, k) - 1) * 1000;
}

export default WebsocketClientService;

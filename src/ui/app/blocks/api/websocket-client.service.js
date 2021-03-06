/*
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { EventEmitter } from 'events';

const ERROR = 'ERROR';
const EVENT = 'EVENT';

class WebsocketClientService extends EventEmitter {

    constructor($q, $rootScope, $location) {
        'ngInject';

        super();

        this._$q = $q;
        this._$rootScope = $rootScope;
        this._connectionAttempts = 1;
        this._eventsSubscribed = new Set();
        this._currentOnGoingMessages = {};
        this._apiPath = location.pathname.replace($location.path(), '');

        if (this._apiPath[0] !== '/') {
            this._apiPath = '/' + this._apiPath;
        }

        if (this._apiPath.slice(-1) !== '/') {
            this._apiPath = this._apiPath + '/';
        }

        this._apiPath = this._apiPath + 'api/v1/ws';
    }

    connect() {
        const defer = this._$q.defer();

        if (_.isUndefined(this._websocket) || this._websocket.readyState === WebSocket.CLOSED) {
            this._websocket = new WebSocket(`ws://${location.hostname}:${location.port}${this._apiPath}`);

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

            this._websocket.onerror = (x) => {
                if (x.type === 'error') {
                    window.location.assign('/diagnostics/');
                }
                defer.reject();
            };

            this._websocket.onclose = (event) => {
                if (event.code === 401) {
                    this.emit(ERROR, event.reason);
                } else if (this._reconnect) {
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

        this._eventsSubscribed.forEach((key) => {
            const message = JSON.parse(key);

            promises.push(this.unsubscribeEvent(message.action, message.body));
        });

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
                this._eventsSubscribed.add(createKey(message));

                return response;
            });
    }

    unsubscribeEvent(action, body) {
        const message = {
            action,
            body,
            operation: 'unwatch'
        };
        const key = createKey(message);

        return this._$q.when(this._eventsSubscribed.has(key) && this.sendMessage(message)
                .then(() => this._eventsSubscribed.delete(key)));
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

    addErrorEventListener(callback) {
        this.on(ERROR, callback);
    }

    removeErrorEventListener(callback) {
        this.removeListener(ERROR, callback);
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

function createKey(obj) {
    return JSON.stringify(_.omitBy(obj, (value, key) => _.isEmpty(value) || _.includes(['correlation', 'operation'], key)));
}

export default WebsocketClientService;

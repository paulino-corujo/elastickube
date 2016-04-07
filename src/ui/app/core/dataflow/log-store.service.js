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

import AbstractStore from './abstract-store';

const CHANGE_EVENT = 'change';

class LogStoreService extends AbstractStore {
    constructor(session, actions, dispatcher) {
        'ngInject';

        super(session);

        this._actions = actions;
        this.logs = {};

        this.dispatchToken = dispatcher.register((action) => {
            switch (action.type) {
                case this._actions.LOGS_LOADED:
                    _.set(this.logs, `${action.namespace}.${action.name}.${action.container}`, _.get(action, 'logs.body.items', []));
                    this.emit(`${CHANGE_EVENT}.${action.namespace}.${action.name}.${action.container}`);
                    break;
                default:
            }
        });
    }

    getLogs(namespace, podName, container) {
        return _.get(this.logs, `${namespace}.${podName}.${container}`, []);
    }

    addLogChangeListener(namespace, podName, container, callback) {
        this.on(`${CHANGE_EVENT}.${namespace}.${podName}.${container}`, callback);
    }

    removeLogChangeListener(namespace, podName, container, callback) {
        this.removeListener(`${CHANGE_EVENT}.${namespace}.${podName}.${container}`, callback);
        if (this.listenerCount(`${CHANGE_EVENT}.${namespace}.${podName}.${container}`) === 0) {
            const pod = _.get(this.logs, `${namespace}.${podName}`);

            if (angular.isDefined(pod)) {
                delete pod[container];
                if (_.size(pod) === 0) {
                    delete this.logs[namespace][podName];
                }
            }
        }
    }
}

export default LogStoreService;

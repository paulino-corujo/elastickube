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

import AbstractAPI from './abstract-api';

class InstancesAPIService extends AbstractAPI {

    constructor($q, websocketClient) {
        'ngInject';

        super('instances', websocketClient);

        this._$q = $q;
        this.initializeSubscriptions();
    }

    initializeSubscriptions() {
        this._namespaceSubscriptions = {};
    }

    subscribe(body) {
        this._namespaceSubscriptions[body.namespace] = this._namespaceSubscriptions[body.namespace] || 0;
        this._namespaceSubscriptions[body.namespace] += 1;

        if (this._namespaceSubscriptions[body.namespace] > 1) {
            return this._$q.when([]);
        }

        return this._ws.subscribeEvent(this._name, body)
            .then((x) => x && x.body);
    }

    unsubscribe(body) {
        const namespace = body.namespace;

        this._namespaceSubscriptions[namespace] = Math.max(this._namespaceSubscriptions[namespace] || 0, 1);
        this._namespaceSubscriptions[namespace] -= 1;

        if (this._namespaceSubscriptions[namespace] > 0) {
            return this._$q.when();
        }

        return this._ws.unsubscribeEvent(this._name, body)
            .then(() => namespace);
    }
}

export default InstancesAPIService;

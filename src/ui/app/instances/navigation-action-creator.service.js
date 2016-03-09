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

class NavigationActionCreatorService {
    constructor(routerHelper, sessionStore) {
        'ngInject';

        this._routerHelper = routerHelper;
        this._sessionStore = sessionStore;
    }

    instance({ namespace, instanceId } = {}) {
        if (_.isUndefined(namespace)) {
            throw Error('namespace parameter is mandatory');
        }

        if (_.isUndefined(instanceId)) {
            throw Error('instanceId parameter is mandatory');
        }

        return this._routerHelper.changeToState('instance', { namespace, instanceId });
    }

    instances(namespace = this._sessionStore.getActiveNamespace()) {
        return this._routerHelper.changeToState('instances', { namespace: namespace.metadata.name });
    }

    newInstance() {
        return this._routerHelper.changeToState('new-instance');
    }
}

export default NavigationActionCreatorService;

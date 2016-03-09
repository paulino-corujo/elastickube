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

class EventsActionCreatorService {
    constructor(actions, dispatcher, instanceAPI) {
        'ngInject';

        this._actions = actions;
        this._dispatcher = dispatcher;
        this._instanceAPI = instanceAPI;

        instanceAPI.addOnCreatedListener((item) => this._dispatcher.dispatch({ type: this._actions.INSTANCE_CREATED, item }));
        instanceAPI.addOnUpdatedListener((item) => this._dispatcher.dispatch({ type: this._actions.INSTANCE_UPDATED, item }));
        instanceAPI.addOnDeletedListener((item) => this._dispatcher.dispatch({ type: this._actions.INSTANCE_DELETED, item }));
    }

    subscribe(instance) {
        this._dispatcher.dispatch({ type: this._actions.INSTANCE_SUBSCRIBE, instance });

        return this._instanceAPI.subscribe({ namespace: instance.metadata.namespace, kind: instance.kind, name: instance.metadata.name })
            .then((items) => this._dispatcher.dispatch({ type: this._actions.INSTANCE_SUBSCRIBED, items }));
    }

    unsubscribe(instance) {
        this._dispatcher.dispatch({ type: this._actions.INSTANCE_UNSUBSCRIBE, instance });

        return this._instanceAPI.unsubscribe({ namespace: instance.metadata.namespace, kind: instance.kind, name: instance.metadata.name })
            .then(() => this._dispatcher.dispatch({ type: this._actions.INSTANCE_UNSUBSCRIBED, instance }));
    }
}

export default EventsActionCreatorService;

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

class InstancesController {
    constructor($scope, instancesNavigationActionCreator, instancesStore, sessionStore) {
        'ngInject';

        const onChange = () => this.instances = instancesStore.getAll(sessionStore.getActiveNamespace().metadata.name);
        const removeInstancesListener = () => instancesStore.removeChangeListener(onChange);

        this._instancesNavigationActionCreator = instancesNavigationActionCreator;

        instancesStore.addChangeListener(onChange);
        sessionStore.addNamespaceChangeListener(removeInstancesListener);

        this.instances = instancesStore.getAll(sessionStore.getActiveNamespace().metadata.name);
        this.selectedInstances = [];
        this.selectedView = 'list';
        this.showEmpty = true;
        this.instancesFilteredByOwnerAndStatus = [];
        this.instancesFilteredBySearch = [];

        $scope.$watchCollection('ctrl.instancesFilteredBySearch', (x) => this.showEmpty = _.isEmpty(x));

        $scope.$on('$destroy', () => {
            removeInstancesListener();
            sessionStore.removeNamespaceChangeListener(removeInstancesListener);
        });
    }

    selectView(name) {
        this.selectedView = name;
    }

    newInstance() {
        this._instancesNavigationActionCreator.newInstance();
    }
}

export default InstancesController;

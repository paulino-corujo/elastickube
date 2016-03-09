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

class InstanceController {
    constructor($scope, instancesNavigationActionCreator, instanceStore) {
        'ngInject';

        const onChange = () => this._updateInstance();

        this._instancesNavigationActionCreator = instancesNavigationActionCreator;
        this._instanceStore = instanceStore;

        this._updateInstance();

        instanceStore.addChangeListener(onChange);

        $scope.$on('$destroy', () => instanceStore.removeChangeListener(onChange));
    }

    _updateInstance() {
        this.instance = this._instanceStore.getInstance();

        if (_.isUndefined(this.instance)) {
            return this._instancesNavigationActionCreator.instances();
        }
    }
}

export default InstanceController;

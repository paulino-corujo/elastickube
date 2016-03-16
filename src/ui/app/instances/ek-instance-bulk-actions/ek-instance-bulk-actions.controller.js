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

class InstanceActionsController {
    constructor($q, $scope, confirmDialog, instancesActionCreator) {
        'ngInject';

        this._$q = $q;
        this._$scope = $scope;
        this._confirmDialog = confirmDialog;
        this._instancesActionCreator = instancesActionCreator;
    }

    delete() {
        this.drop.close();

        return this._confirmDialog
            .confirm({
                title: 'Confirm Action',
                content: 'Do you want to DELETE selected instances?',
                ok: 'OK',
                cancel: 'CANCEL'
            })
            .then(() => {
                return this._$q.all(this.instances.map((x) => this._instancesActionCreator.delete(x)));
            });
    }
}

export default InstanceActionsController;

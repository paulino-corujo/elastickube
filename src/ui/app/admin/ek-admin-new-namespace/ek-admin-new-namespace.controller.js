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

class AdminNewNamespaceController {
    constructor($scope, principalStore, namespacesActionCreator) {
        'ngInject';

        this._namespacesActionCreator = namespacesActionCreator;
        this._principalStore = principalStore;

        $scope.$watchGroup(['ctrl.form.$valid', 'ctrl.users'], (values) => {
            this.dialogController.canAccept = values[0] && values[1].length > 0;
        });

        this.users = [principalStore.getPrincipal()];
    }

    removeUser(user) {
        this.users = _.without(this.users, user);
    }

    accept() {
        return this._namespacesActionCreator.createNamespace(this.namespaceName, this.users);
    }
}

export default AdminNewNamespaceController;

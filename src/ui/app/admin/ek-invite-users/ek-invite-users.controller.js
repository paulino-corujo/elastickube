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

class InviteUsersController {
    constructor($scope, $mdDialog, namespacesStore, usersActionCreator) {
        'ngInject';

        const onChange = () => this.namespaces = namespacesStore.getAll();

        this._$mdDialog = $mdDialog;
        this._usersActionCreator = usersActionCreator;

        this.namespaces = namespacesStore.getAll();
        this.selectedNamespaces = [];
        this.emails = [];
        this.note = '';

        namespacesStore.addChangeListener(onChange);

        $scope.$on('$destroy', () => namespacesStore.removeChangeListener(onChange));
    }

    toggleSelection(namespace) {
        if (_.includes(this.selectedNamespaces, namespace.metadata.name)) {
            this.selectedNamespaces = _.without(this.selectedNamespaces, namespace.metadata.name);
        } else {
            this.selectedNamespaces = this.selectedNamespaces.concat(namespace.metadata.name);
        }
    }

    cancel() {
        this._$mdDialog.hide();
    }

    send() {
        this._usersActionCreator.invite({ emails: this.emails, note: this.note, namespaces: this.selectedNamespaces });
        this.cancel();
    }
}

export default InviteUsersController;

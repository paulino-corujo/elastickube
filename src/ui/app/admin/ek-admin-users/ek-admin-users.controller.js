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

class AdminUsersController {
    constructor($scope, adminNavigationActionCreator, usersStore, settingsStore) {
        'ngInject';

        const onUsersChange = () => this.users = usersStore.getAll();

        this._settingsStore = settingsStore;
        this._adminNavigationActionCreator = adminNavigationActionCreator;

        this.bulkActions = 'Bulk Actions';
        this.users = usersStore.getAll();
        this.filteredUsers = [];

        this.tableOptions = {
            data: 'ctrl.filteredUsers',
            getIdentity: (item) => item.username,
            columnDefs: [
                {
                    name: 'name',
                    cellTemplate: `
                    <div ng-if="!item.email_validated_at">--</div>
                    <ek-user-info ng-if="!!item.email_validated_at" username="item.username"></ek-user-info>
                    `,
                    sortingAlgorithm: (a, b) => {
                        const nameA = `${a.firstname} ${a.lastname || ''}`.toLowerCase();
                        const nameB = `${b.firstname} ${b.lastname || ''}`.toLowerCase();

                        if (nameA > nameB) {
                            return 1;
                        } else if (nameA < nameB) {
                            return -1;
                        }

                        return 0;
                    }
                },
                {
                    name: 'username',
                    field: 'username',
                    cellTemplate: `
                    <div ng-if="!item.email_validated_at">--</div>
                    <div ng-if="!!item.email_validated_at">{{ item.username }}</div>
                    `
                },
                {
                    name: 'email',
                    field: 'email'
                },
                {
                    name: 'created',
                    field: 'metadata.creationTimestamp',
                    cellTemplate: `
                    <div ng-if="!item.email_validated_at" class="ek-admin-users__invitation-pending">Invitation pending</div>
                    <div ng-if="!!item.email_validated_at">
                        {{ item.metadata.creationTimestamp | ekHumanizeDate: 'epoch' }} ago
                    </div>`
                }
            ]
        };

        usersStore.addChangeListener(onUsersChange);

        $scope.$on('$destroy', () => usersStore.removeChangeListener(onUsersChange));
    }

    inviteUsers() {
        const settings = this._settingsStore.getSettings();

        if (_.isUndefined(settings.mail)) {
            return this._adminNavigationActionCreator.warnOutboundEmailDisabled();
        }
        return this._adminNavigationActionCreator.inviteUsers();
    }
}

export default AdminUsersController;

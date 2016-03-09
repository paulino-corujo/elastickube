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

import rowTemplate from './ek-admin-users-row.template.html';

class AdminUsersController {
    constructor($scope, adminNavigationActionCreator, usersStore, settingsStore) {
        'ngInject';

        const onUsersChange = () => this.users = usersStore.getAll();
        const onRowSelectionChanged = () => this.hasRowsSelected = !_.isEmpty(this.gridApi.selection.getSelectedRows());

        this._$scope = $scope;
        this._settingsStore = settingsStore;
        this._adminNavigationActionCreator = adminNavigationActionCreator;

        this.bulkActions = 'Bulk Actions';
        this.users = usersStore.getAll();
        this.filteredUsers = [];

        this.gridOptions = {
            rowTemplate,
            data: 'ctrl.filteredUsers',
            enableFiltering: false,
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 50,
            rowHeight: 50,
            columnDefs: [
                {
                    name: 'name',
                    enableColumnMenu: false,
                    cellTemplate: `
                    <div ng-if="!row.entity.email_validated_at">--</div>
                    <ek-user-info ng-if="!!row.entity.email_validated_at" username="row.entity.username"></ek-user-info>
                    `,
                    sortingAlgorithm: (a, b, rowA, rowB) => {
                        const nameA = `${rowA.entity.firstname} ${rowA.entity.lastname || ''}`.toLowerCase();
                        const nameB = `${rowB.entity.firstname} ${rowB.entity.lastname || ''}`.toLowerCase();

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
                    enableColumnMenu: false,
                    cellTemplate: `
                    <div ng-if="!row.entity.email_validated_at">--</div>
                    <div ng-if="!!row.entity.email_validated_at">{{ row.entity.username }}</div>
                    `
                },
                { name: 'email', enableColumnMenu: false },
                {
                    name: 'created',
                    enableColumnMenu: false,
                    cellTemplate: `
                    <div ng-if="!row.entity.email_validated_at" class="ek-admin-users__invitation-pending">Invitation pending</div>
                    <div ng-if="!!row.entity.email_validated_at">
                        {{ row.entity.metadata.creationTimestamp | ekHumanizeDate: 'epoch' }} ago
                    </div>`
                }
            ],
            onRegisterApi: (gridApi) => {
                this.gridApi = gridApi;

                gridApi.selection.on.rowSelectionChanged($scope, onRowSelectionChanged);
                gridApi.selection.on.rowSelectionChangedBatch($scope, onRowSelectionChanged);
            }
        };

        usersStore.addChangeListener(onUsersChange);

        $scope.$on('$destroy', () => usersStore.removeChangeListener(onUsersChange));
    }

    inviteUsers() {
        const settings = this._settingsStore.getSettings();

        if (_.isUndefined(settings.mail)) {
            return this._adminNavigationActionCreator.warnOutboundEmailDisabled(this._$scope);
        }
        return this._adminNavigationActionCreator.inviteUsers();
    }
}

export default AdminUsersController;

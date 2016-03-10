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

import rowTemplate from './ek-admin-namespaces-row.template.html';

class AdminNamespacesController {
    constructor($scope, confirmDialog, instancesStore, namespacesStore) {
        'ngInject';

        const onChange = () => this.namespaces = namespacesStore.getAll();
        namespacesStore.addChangeListener(onChange);

        this._$scope = $scope;
        this._confirmDialog = confirmDialog;
        this._instancesStore = instancesStore;

        this.bulkActions = 'Bulk Actions';
        this.namespaces = namespacesStore.getAll();
        this.filteredNamespaces = [];

        this.gridOptions = {
            rowTemplate,
            data: 'ctrl.filteredNamespaces',
            enableFiltering: false,
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 50,
            rowHeight: 50,
            columnDefs: [
                {
                    name: 'name',
                    field: 'metadata.name',
                    enableColumnMenu: false
                },
                {
                    name: 'labels',
                    field: 'metadata.labels',
                    enableColumnMenu: false,
                    cellTemplate: `<ek-labels labels="row.entity.metadata.labels"></ek-labels>`,
                    sortingAlgorithm: (a, b) => {
                        const sizeA = _.size(a);
                        const sizeB = _.size(b);

                        if (sizeA > sizeB) {
                            return 1;
                        } else if (sizeA < sizeB) {
                            return -1;
                        }

                        return 0;
                    }
                },
                {
                    name: 'members',
                    cellTemplate: `<div>{{ row.entity.members.length }}</div>`,
                    enableColumnMenu: false
                },
                {
                    name: 'instances',
                    enableColumnMenu: false,
                    cellTemplate: `<div>{{ grid.appScope.ctrl.getInstances(row.entity) }}</div>`,
                    sortingAlgorithm: (a, b, rowA, rowB) => {
                        const sizeA = _.size(this._instancesStore.getAll(rowA.entity.metadata.name));
                        const sizeB = _.size(this._instancesStore.getAll(rowB.entity.metadata.name));

                        if (sizeA > sizeB) {
                            return 1;
                        } else if (sizeA < sizeB) {
                            return -1;
                        }

                        return 0;
                    }
                }
            ],
            onRegisterApi: (gridApi) => {
                this.gridApi = gridApi;

                gridApi.selection.on.rowSelectionChanged($scope, () =>
                    this.hasRowsSelected = !_.isEmpty(gridApi.selection.getSelectedRows()));

                gridApi.selection.on.rowSelectionChangedBatch($scope, () =>
                    this.hasRowsSelected = !_.isEmpty(gridApi.selection.getSelectedRows()));
            }
        };

        $scope.$on('$destroy', () => {
            namespacesStore.removeChangeListener(onChange);
        });
    }

    newNamespace() {
        return this._confirmDialog.confirm(this._$scope, {
            template: '<ek-admin-new-namespace></ek-admin-new-namespace>',
            ok: 'CREATE',
            cancel: 'CANCEL'
        });
    }

    getInstances(namespace) {
        return this._instancesStore.getAll(namespace.metadata.name).length;
    }
}

export default AdminNamespacesController;

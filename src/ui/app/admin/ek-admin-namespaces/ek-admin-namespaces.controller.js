import rowTemplate from './ek-admin-namespaces-row.template.html';

class AdminNamespacesController {
    constructor($scope, instancesStore, namespacesStore) {
        'ngInject';

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
                { name: 'members', enableColumnMenu: false },
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
    }

    getInstances(namespace) {
        return this._instancesStore.getAll(namespace.metadata.name).length;
    }
}

export default AdminNamespacesController;

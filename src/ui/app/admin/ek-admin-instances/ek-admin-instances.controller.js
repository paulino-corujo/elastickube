import rowTemplate from './ek-admin-instances-row.template.html';

class AdminInstancesController {
    constructor($scope, instancesStore) {
        'ngInject';

        this.bulkActions = 'Bulk Actions';
        this.instances = instancesStore.getAll();
        this.filteredInstances = [];

        this.gridOptions = {
            rowTemplate,
            data: 'ctrl.filteredInstances',
            enableFiltering: false,
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 50,
            rowHeight: 50,
            showGridFooter: true,
            columnDefs: [
                {
                    name: 'name',
                    field: 'metadata.name',
                    enableColumnMenu: false,
                    cellTemplate: `<ek-instance-name instance="row.entity"></ek-instance-name>`
                },
                {
                    name: 'state',
                    field: 'status.phase',
                    enableColumnMenu: false,
                    cellTemplate: `<ek-instance-state instance="row.entity"></ek-instance-state>`
                },
                {
                    name: 'labels',
                    field: 'metadata.labels',
                    enableColumnMenu: false,
                    cellTemplate: `<p>{{ row.entity.metadata.name }}</p>`
                },
                {
                    name: 'serviceId',
                    displayName: 'Service ID',
                    field: 'metadata.name',
                    enableColumnMenu: false,
                    cellTemplate: `<ek-instance-labels instance="row.entity"></ek-instance-labels>`
                },
                {
                    name: 'modified',
                    field: 'status.startTime',
                    enableColumnMenu: false,
                    cellTemplate: `<ek-instance-modified instance="row.entity"></ek-instance-modified>`
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
}

export default AdminInstancesController;

import rowTemplate from './ek-admin-instances-row.template.html';

class AdminInstancesController {
    constructor($scope, instancesStore, instancesActionCreator, instancesNavigationActionCreator, namespacesStore) {
        'ngInject';

        this._instancesNavigationActionCreator = instancesNavigationActionCreator;

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
                    name: 'serviceType',
                    displayName: 'Service Type',
                    field: 'kind',
                    enableColumnMenu: false,
                    cellTemplate: `<p>{{ row.entity.kind }}</p>`
                },
                {
                    name: 'modified',
                    field: 'metadata.creationTimestamp',
                    enableColumnMenu: false,
                    cellTemplate: `<div>{{ row.entity.metadata.creationTimestamp | ekHumanizeDate }} ago</div>`
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

        $scope.$on('$destroy', () => _.map(namespacesStore.getAll(), (x) => instancesActionCreator.unsubscribe(x)));
    }

    newInstance() {
        this._instancesNavigationActionCreator.newInstance();
    }
}

export default AdminInstancesController;

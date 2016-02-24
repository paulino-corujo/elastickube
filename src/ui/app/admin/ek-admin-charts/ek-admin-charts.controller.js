import rowTemplate from './ek-admin-charts-row.template.html';

class AdminChartsController {
    constructor($scope, chartsStore) {
        'ngInject';

        const onChange = () => this.charts = this._chartsStore.getAll();

        this._chartsStore = chartsStore;
        this._chartsStore.addChangeListener(onChange);

        this.bulkActions = 'Bulk Actions';
        this.charts = this._chartsStore.getAll();
        this.filteredCharts = [];

        this.gridOptions = {
            rowTemplate,
            data: 'ctrl.filteredCharts',
            enableFiltering: false,
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 50,
            rowHeight: 50,
            showGridFooter: true,
            columnDefs: [
                {
                    name: 'name',
                    field: 'name',
                    enableColumnMenu: false
                },
                {
                    name: 'maintainers',
                    enableColumnMenu: false,
                    cellTemplate: `<div>{{ row.entity.maintainers[0] }}</div>`
                },
                {
                    name: 'modified',
                    enableColumnMenu: false,
                    cellTemplate: `<div>{{ row.entity.committed_date | ekHumanizeDate: 'epoch' }} ago</div>`
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

        $scope.$on('$destroy', () => this._chartsStore.removeChangeListener(onChange));
    }
}

export default AdminChartsController;

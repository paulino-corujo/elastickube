import rowTemplate from './ek-chart-list-row.template.html';

class ChartListController {
    constructor($scope) {
        'ngInject';

        this.gridOptions = {
            rowTemplate,
            data: 'ctrl.charts',
            enableFiltering: false,
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 50,
            rowHeight: 50,
            columnDefs: [
                {
                    name: 'chart',
                    field: 'name',
                    enableColumnMenu: false,
                    cellTemplate: `<ek-chart-name chart="row.entity"></ek-chart-name>`
                },
                {
                    name: 'maintainers',
                    enableColumnMenu: false,
                    cellTemplate: `<div>{{ row.entity.maintainers[0] }}</div>`
                },
                {
                    name: 'modified',
                    field: 'committed_date',
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
    }
}

export default ChartListController;

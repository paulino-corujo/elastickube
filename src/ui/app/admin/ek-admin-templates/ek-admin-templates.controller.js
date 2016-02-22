import templatesMock from 'mocks/templates';
import rowTemplate from './ek-admin-templates-row.template.html';

class AdminTemplatesController {
    constructor($scope) {
        'ngInject';

        this.bulkActions = 'Bulk Actions';
        this.templates = templatesMock;
        this.filteredTemplates = [];

        this.gridOptions = {
            rowTemplate,
            data: 'ctrl.filteredTemplates',
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
                { name: 'type', enableColumnMenu: false },
                { name: 'members', enableColumnMenu: false },
                {
                    name: 'modified',
                    enableColumnMenu: false,
                    cellTemplate: `<div>{{ row.entity.created | ekHumanizeDate }} ago</div>`
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

export default AdminTemplatesController;

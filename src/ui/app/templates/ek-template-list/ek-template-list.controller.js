import rowTemplate from './ek-template-list-row.template.html';

class TemplateListController {
    constructor($scope) {
        'ngInject';

        this.gridOptions = {
            rowTemplate,
            data: 'ctrl.templates',
            enableFiltering: false,
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 50,
            rowHeight: 50,
            showGridFooter: true,
            columnDefs: [
                {
                    name: 'template',
                    field: 'name',
                    enableColumnMenu: false,
                    cellTemplate: `<ek-template-name template="row.entity"></ek-template-name>`
                },
                { name: 'type', enableColumnMenu: false },
                { name: 'members', enableColumnMenu: false },
                {
                    name: 'modified',
                    field: 'updated',
                    enableColumnMenu: false,
                    cellTemplate: `<div>{{ row.entity.updated | ekHumanizeDate }} ago</div>`
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

export default TemplateListController;

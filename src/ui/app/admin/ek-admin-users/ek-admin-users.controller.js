import rowTemplate from './ek-admin-users-row.template.html';

class AdminUsersController {
    constructor($scope, usersStore) {
        'ngInject';

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
            showGridFooter: true,
            columnDefs: [
                {
                    name: 'name',
                    field: 'id',
                    enableColumnMenu: false,
                    cellTemplate: `<ek-user-info user-id="row.entity.id"></ek-user-info>`
                },
                { name: 'username', field: 'id', enableColumnMenu: false },
                { name: 'email', enableColumnMenu: false },
                {
                    name: 'created',
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

export default AdminUsersController;

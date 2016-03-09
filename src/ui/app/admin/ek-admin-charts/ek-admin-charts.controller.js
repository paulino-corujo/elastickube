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
            columnDefs: [
                {
                    name: 'name',
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

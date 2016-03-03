import rowTemplate from './ek-instance-list-row.template.html';

class InstanceListController {
    constructor($scope) {
        'ngInject';

        this.groupedInstances = [];

        this.gridOptions = {
            rowTemplate,
            data: 'ctrl.groupedInstances',
            enableFiltering: false,
            enableRowSelection: true,
            enableSelectAll: true,
            showTreeExpandNoChildren: false,
            selectionRowHeaderWidth: 50,
            rowHeight: 50,
            columnDefs: [
                {
                    name: 'name',
                    field: 'metadata.name',
                    enableColumnMenu: false,
                    cellTemplate: `<div ng-class="{'ek-instance-list__child-row': row.entity.$$treeLevel === 1}">
                        <ek-instance-name instance="row.entity"></ek-instance-name>
                    </div>`
                },
                {
                    name: 'state',
                    field: 'status.phase',
                    enableColumnMenu: false,
                    cellTemplate: `<ek-instance-state instance="row.entity"></ek-instance-state>`
                },
                {
                    name: 'serviceType',
                    displayName: 'Service Type',
                    field: 'kind',
                    enableColumnMenu: false,
                    cellTemplate: `<p>{{ row.entity.kind }}</p>`
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

        $scope.$watchCollection('ctrl.instances', (instances) => {
            this.groupedInstances = this.groupInstances(instances);
            this.containsGroups = _.find(this.groupedInstances, (x) => x.$$treeLevel === 1);
        });
    }

    groupInstances(instances) {
        const key = ['metadata', 'annotations', 'kubernetes.io/created-by'];

        return _.chain(instances)
            .groupBy((instance) => {
                if (_.has(instance, key)) {
                    const data = JSON.parse(_.get(instance, key));

                    return data.reference.uid;
                }

                return instance.metadata.uid;
            })
            .mapValues((items) => {
                const parent = _.find(items, (x) => !_.has(x, key));

                return _.chain(items)
                    .map((x) => {
                        const item = angular.copy(x);

                        item.$$treeLevel = _.has(item, key) && !_.isUndefined(parent) ? 1 : 0;

                        return item;
                    })
                    .sortBy('$$treeLevel')
                    .value();
            })
            .values()
            .flatten()
            .value();
    }
}

export default InstanceListController;

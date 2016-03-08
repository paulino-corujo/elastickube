import rowTemplate from './ek-admin-instances-row.template.html';

class AdminInstancesController {
    constructor($scope, instancesStore, instancesActionCreator, instancesNavigationActionCreator, namespacesStore, sessionActionCreator,
                sessionStore) {
        'ngInject';

        const onChange = () => this.instances = instancesStore.getAll();
        const onCollapsedChange = () => {
            if (!_.isUndefined(this.gridApi.treeBase)) {
                this._synchronizing = true;

                _.without(this._expandedInstances, sessionStore.getExpandedAdminInstances()).forEach((x) => {
                    const instance = instancesStore.get(x);

                    if (!_.isUndefined(instance)) {
                        const row = _.find(this.gridApi.grid.rows, _.matchesProperty('entity.metadata.uid', instance.metadata.uid));

                        if (!_.isUndefined(row)) {
                            this.gridApi.treeBase.collapseRow(row);
                        }
                    }
                });

                _.without(sessionStore.getExpandedAdminInstances(), this._expandedInstances).forEach((x) => {
                    const instance = instancesStore.get(x);

                    if (!_.isUndefined(instance)) {
                        const row = _.find(this.gridApi.grid.rows, _.matchesProperty('entity.metadata.uid', instance.metadata.uid));

                        if (!_.isUndefined(row)) {
                            this.gridApi.treeBase.expandRow(row);
                        }
                    }
                });

                this._expandedInstances = sessionStore.getExpandedAdminInstances();
                this._synchronizing = false;
            }
        };

        this._synchronizing = false;
        this._expandedInstances = sessionStore.getExpandedAdminInstances();
        this._instancesNavigationActionCreator = instancesNavigationActionCreator;

        this.bulkActions = 'Bulk Actions';
        this.instances = instancesStore.getAll();
        this.filteredInstances = [];
        this.groupedInstances = [];

        instancesStore.addChangeListener(onChange);

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
                    cellTemplate: `<div ng-class="{'ek-admin-instances__child-row': row.entity.$$treeLevel === 1}">
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
                    name: 'kind',
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
                const saveGroupStates = () => {
                    if (!this._synchronizing) {
                        sessionActionCreator.saveCollapsedAdminInstancesState(_.chain(this.gridApi.grid.rows)
                            .filter(_.matchesProperty('treeNode.state', 'expanded'))
                            .map((x) => _.get(x, 'entity.metadata.uid'))
                            .value());
                    }
                };

                this.gridApi = gridApi;

                gridApi.selection.on.rowSelectionChanged($scope, () =>
                    this.hasRowsSelected = !_.isEmpty(gridApi.selection.getSelectedRows()));

                gridApi.selection.on.rowSelectionChangedBatch($scope, () =>
                    this.hasRowsSelected = !_.isEmpty(gridApi.selection.getSelectedRows()));

                if (!_.isUndefined(gridApi.treeBase)) {
                    gridApi.treeBase.on.rowCollapsed($scope, saveGroupStates);
                    gridApi.treeBase.on.rowExpanded($scope, saveGroupStates);
                }

                gridApi.grid.registerRowsProcessor((renderableRows) => {
                    if (!_.isUndefined(this.gridApi.treeBase)) {
                        this._synchronizing = true;

                        if (_.isUndefined(this._expandedInstances)) {
                            this.gridApi.treeBase.expandAllRows();
                        } else {
                            this._expandedInstances.forEach((x) => {
                                const instance = instancesStore.get(x);

                                if (!_.isUndefined(instance)) {
                                    const row = _.find(this.gridApi.grid.rows, _.matchesProperty('entity.metadata.uid', instance.metadata.uid));

                                    if (!_.isUndefined(row)) {
                                        this.gridApi.treeBase.expandRow(row);
                                    }
                                }
                            });
                        }

                        this._synchronizing = false;
                    }

                    return renderableRows;
                });
            }
        };

        sessionStore.addExpandedAdminInstancesChangeListener(onCollapsedChange);

        $scope.$watchCollection('ctrl.filteredInstances', (instances) => {
            this.groupedInstances = this.groupInstances(instances);
            this.containsGroups = _.find(this.groupedInstances, (x) => x.$$treeLevel === 1);
        });

        $scope.$on('$destroy', () => {
            instancesStore.removeChangeListener(onChange);
            sessionStore.removeExpandedAdminInstancesChangeListener(onCollapsedChange);
            _.map(namespacesStore.getAll(), (x) => instancesActionCreator.unsubscribe(x));
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

                        if (_.size(items) > 1 && !_.isUndefined(parent)) {
                            item.$$treeLevel = _.has(item, key) ? 1 : 0;
                        } else {
                            item.$$treeLevel = 0;
                        }

                        return item;
                    })
                    .sortBy('$$treeLevel')
                    .value();
            })
            .values()
            .flatten()
            .value();
    }

    newInstance() {
        this._instancesNavigationActionCreator.newInstance();
    }
}

export default AdminInstancesController;

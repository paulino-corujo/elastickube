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

import rowTemplate from './ek-instance-list-row.template.html';

class InstanceListController {
    constructor($scope, instancesStore, sessionActionCreator, sessionStore) {
        'ngInject';

        const onCollapsedChange = () => {
            if (!_.isUndefined(this.gridApi.treeBase)) {
                this._synchronizing = true;

                _.without(this._expandedInstances, sessionStore.getExpandedInstances()).forEach((x) => {
                    const instance = instancesStore.get(x);

                    if (!_.isUndefined(instance)) {
                        const row = _.find(this.gridApi.grid.rows, _.matchesProperty('entity.metadata.uid', instance.metadata.uid));

                        if (!_.isUndefined(row)) {
                            this.gridApi.treeBase.collapseRow(row);
                        }
                    }
                });

                _.without(sessionStore.getExpandedInstances(), this._expandedInstances).forEach((x) => {
                    const instance = instancesStore.get(x);

                    if (!_.isUndefined(instance)) {
                        const row = _.find(this.gridApi.grid.rows, _.matchesProperty('entity.metadata.uid', instance.metadata.uid));

                        if (!_.isUndefined(row)) {
                            this.gridApi.treeBase.expandRow(row);
                        }
                    }
                });

                this._expandedInstances = sessionStore.getExpandedInstances();
                this._synchronizing = false;
            }
        };

        this._synchronizing = false;
        this._expandedInstances = sessionStore.getExpandedInstances();

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
                    width: '25%',
                    cellTemplate: `<div ng-class="{'ek-instance-list__child-row': row.entity.$$treeLevel === 1}">
                        <ek-instance-name instance="row.entity"></ek-instance-name>
                    </div>`
                },
                {
                    name: 'state',
                    field: 'status.phase',
                    enableColumnMenu: false,
                    width: '15%',
                    cellTemplate: `<ek-instance-state instance="row.entity"></ek-instance-state>`
                },
                {
                    name: 'kind',
                    field: 'kind',
                    enableColumnMenu: false,
                    width: '18%',
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
                },
                {
                    name: 'actions',
                    displayName: '',
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: `<div class="ek-instance-list__table__actions" layout="row" layout-align="end center">
                            <ek-instance-actions instance="row.entity"></ek-instance-actions>
                        </div>`
                }
            ],
            onRegisterApi: (gridApi) => {
                const selectInstance = () => this.selectedInstances = gridApi.selection.getSelectedRows();
                const saveGroupStates = () => {
                    if (!this._synchronizing) {
                        sessionActionCreator.saveCollapsedInstancesState(_.chain(this.gridApi.grid.rows)
                            .filter(_.matchesProperty('treeNode.state', 'expanded'))
                            .map((x) => _.get(x, 'entity.metadata.uid'))
                            .value());
                    }
                };

                this.gridApi = gridApi;

                gridApi.selection.on.rowSelectionChanged($scope, selectInstance);
                gridApi.selection.on.rowSelectionChangedBatch($scope, selectInstance);

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
                                    const row = _.find(this.gridApi.grid.rows, _.matchesProperty('entity.metadata.uid',
                                        instance.metadata.uid));

                                    if (!_.isUndefined(row)) {
                                        this.gridApi.treeBase.expandRow(row);
                                    }
                                }
                            });
                        }
                        this._synchronizing = false;
                    }

                    if (!_.isEmpty(this.selectedInstances)) {
                        this.selectedInstances = _.chain(this.selectedInstances)
                            .map((x) => {
                                const row = _.find(gridApi.grid.rows, _.matchesProperty('entity.metadata.uid', x.metadata.uid));

                                if (!_.isUndefined(row)) {
                                    if (!row.isSelected) {
                                        row.setSelected(true);
                                    }

                                    return _.get(row, 'entity');
                                }
                            })
                            .compact()
                            .value();
                    }

                    return renderableRows;
                });
            }
        };

        sessionStore.addExpandedInstancesChangeListener(onCollapsedChange);

        $scope.$watchCollection('ctrl.instances', (instances) => {
            this.groupedInstances = this.groupInstances(instances);
            this.containsGroups = _.find(this.groupedInstances, (x) => x.$$treeLevel === 1);
        });

        $scope.$on('$destroy', () => sessionStore.removeExpandedInstancesChangeListener(onCollapsedChange));
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
}

export default InstanceListController;

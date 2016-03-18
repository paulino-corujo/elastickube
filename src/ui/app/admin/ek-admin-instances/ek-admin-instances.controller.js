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

class AdminInstancesController {
    constructor($scope, instancesStore, instancesActionCreator, instancesNavigationActionCreator, namespacesStore, sessionActionCreator,
                sessionStore) {
        'ngInject';

        const onChange = () => this.instances = instancesStore.getAll();

        this._instancesNavigationActionCreator = instancesNavigationActionCreator;

        this.bulkActions = 'Bulk Actions';
        this.instances = instancesStore.getAll();
        this.filteredInstances = angular.copy(this.instances);
        this.groupedInstances = [];

        this.instancesStatus = sessionStore.getAdminInstancesStatus();
        this.selectedInstances = _.filter(this.instances, (x) =>
            _.includes(_.get(this.instancesStatus, 'selection', []), x.metadata.uid));

        this.tableOptions = {
            data: 'ctrl.groupedInstances',
            enableSelection: true,
            groupField: '_childItems',
            getIdentity: (item) => item.metadata.uid,
            columnDefs: [
                {
                    name: 'name',
                    field: 'metadata.name',
                    width: '25%',
                    cellTemplate: `<div ng-class="{'ek-instance-list__child-row': item._groupChild}">
                        <ek-instance-name instance="item"></ek-instance-name>
                    </div>`
                },
                {
                    name: 'state',
                    field: 'status.phase',
                    width: '15%',
                    cellTemplate: `<ek-instance-state instance="item"></ek-instance-state>`
                },
                {
                    name: 'kind',
                    field: 'kind',
                    width: '18%'
                },
                {
                    name: 'labels',
                    field: 'metadata.labels',
                    cellTemplate: `<ek-labels labels="item.metadata.labels"></ek-labels>`,
                    sortingAlgorithm: (a, b) => {
                        const sizeA = _.size(a.metadata.labels);
                        const sizeB = _.size(b.metadata.labels);

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
                    cellTemplate: `<div>{{ item.metadata.creationTimestamp | ekHumanizeDate }} ago</div>`
                },
                {
                    name: '',
                    width: '70px',
                    enableSorting: false,
                    cellTemplate: `<div class="ek-instance-list__table__actions" layout="row" layout-align="end center">
                            <ek-instance-actions instance="item"></ek-instance-actions>
                        </div>`
                }
            ]
        };

        instancesStore.addChangeListener(onChange);

        $scope.$watchCollection('ctrl.filteredInstances', (instances) => this.groupedInstances = this.groupInstances(instances));

        $scope.$on('ek-table.status-updated', (evt, status) => {
            this.selectedInstances = _.filter(this.instances, (x) => _.includes(status.selection || [], x.metadata.uid));
            sessionActionCreator.saveAdminInstancesStatus(status);
        });

        $scope.$on('$destroy', () => {
            instancesStore.removeChangeListener(onChange);
            _.map(namespacesStore.getAll(), (x) => instancesActionCreator.unsubscribe(x));
        });
    }

    groupInstances(instances) {
        const key = ['metadata', 'annotations', 'kubernetes.io/created-by'];

        return _.chain(instances)
            .map((x) => angular.copy(x))
            .groupBy((instance) => {
                if (_.has(instance, key)) {
                    const data = JSON.parse(_.get(instance, key));

                    return data.reference.uid;
                }

                return instance.metadata.uid;
            })
            .mapValues((items) => {
                const parent = _.find(items, (x) => !_.has(x, key));

                if (angular.isDefined(parent)) {
                    parent._childItems = _.reject(items, (x) => x === parent);

                    return parent;
                }

                return items;
            })
            .values()
            .value();
    }

    newInstance() {
        this._instancesNavigationActionCreator.newInstance();
    }
}

export default AdminInstancesController;

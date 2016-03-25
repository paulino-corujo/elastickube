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

class InstanceListController {
    constructor($scope, instancesStore, sessionActionCreator, sessionStore) {
        'ngInject';

        this.instancesStatus = sessionStore.getInstancesStatus();
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

        $scope.$on('ek-table.status-updated', (evt, status) => {
            this.selectedInstances = _.filter(this.instances, (x) => _.includes(status.selection || [], x.metadata.uid));
            sessionActionCreator.saveInstancesStatus(status);
        });

        $scope.$watchCollection('ctrl.instances', (instances) => this.groupedInstances = this.groupInstances(instances));
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
}

export default InstanceListController;

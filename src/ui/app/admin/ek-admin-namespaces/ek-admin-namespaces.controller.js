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

class AdminNamespacesController {
    constructor($scope, confirmDialog, instancesStore, namespacesStore) {
        'ngInject';

        const onChange = () => this.namespaces = namespacesStore.getAll();

        namespacesStore.addChangeListener(onChange);

        this._confirmDialog = confirmDialog;
        this._instancesStore = instancesStore;

        this.bulkActions = 'Bulk Actions';
        this.namespaces = namespacesStore.getAll();
        this.filteredNamespaces = [];

        this.tableOptions = {
            data: 'ctrl.filteredNamespaces',
            getIdentity: (item) => item.metadata.uid,
            columnDefs: [
                {
                    name: 'name',
                    field: 'metadata.name'
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
                    name: 'members',
                    cellTemplate: `<div>{{ item.members.length }}</div>`,
                    sortingAlgorithm: (a, b) => {
                        const sizeA = _.size(a.members);
                        const sizeB = _.size(b.members);

                        if (sizeA > sizeB) {
                            return 1;
                        } else if (sizeA < sizeB) {
                            return -1;
                        }

                        return 0;
                    }
                },
                {
                    name: 'instances',
                    cellTemplate: `<div>{{ appScope.ctrl.getInstances(item) }}</div>`,
                    sortingAlgorithm: (a, b) => {
                        const sizeA = _.size(this._instancesStore.getAll(a.metadata.name));
                        const sizeB = _.size(this._instancesStore.getAll(b.metadata.name));

                        if (sizeA > sizeB) {
                            return 1;
                        } else if (sizeA < sizeB) {
                            return -1;
                        }

                        return 0;
                    }
                },
                {
                    name: '',
                    width: '70px',
                    enableSorting: false,
                    cellTemplate: `<div class="ek-admin-namespaces__body__table__actions" layout="row" layout-align="end center" flex>
                            <ek-namespace-actions namespace="item"></ek-namespace-actions>
                        </div>`
                }
            ]
        };

        $scope.$on('$destroy', () => {
            namespacesStore.removeChangeListener(onChange);
        });
    }

    newNamespace() {
        return this._confirmDialog.confirm({
            template: '<ek-admin-edit-namespace></ek-admin-edit-namespace>',
            ok: 'CREATE',
            cancel: 'CANCEL'
        });
    }

    getInstances(namespace) {
        return this._instancesStore.getAll(namespace.metadata.name).length;
    }
}

export default AdminNamespacesController;

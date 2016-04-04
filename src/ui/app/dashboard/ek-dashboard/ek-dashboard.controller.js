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

const mockDataCPU = [{
    timestamp: '2016-03-29 14:36:30',
    value: 55
},{
    timestamp: '2016-03-29 14:36:00',
    value: 65
}, {
    timestamp: '2016-03-29 14:35:30',
    value: 75
}, {
    timestamp: '2016-03-29 14:35:00',
    value: 85
}, {
    timestamp: '2016-03-29 14:34:30',
    value: 80
}, {
    timestamp: '2016-03-29 14:34:00',
    value: 65
}, {
    timestamp: '2016-03-29 14:33:30',
    value: 10
}, {
    timestamp: '2016-03-29 14:33:00',
    value: 16
}, {
    timestamp: '2016-03-29 14:32:30',
    value: 25
}, {
    timestamp: '2016-03-29 14:32:00',
    value: 30
}, {
    timestamp: '2016-03-29 14:31:30',
    value: 40
}, {
    timestamp: '2016-03-29 14:31:00',
    value: 43
}, {
    timestamp: '2016-03-29 14:30:30',
    value: 75
}, {
    timestamp: '2016-03-29 14:30:00',
    value: 65
}, {
    timestamp: '2016-03-29 14:29:30',
    value: 30
}, {
    timestamp: '2016-03-29 14:29:00',
    value: 20
}];
const mockDataMemory = [{
    timestamp: '2016-03-29 10:06:04',
    value: 4.6
}, {
    timestamp: '2016-03-29 10:04:04',
    value: 5.4
}, {
    timestamp: '2016-03-29 10:03:04',
    value: 5
}, {
    timestamp: '2016-03-29 10:00:04',
    value: 4.8
}, {
    timestamp: '2016-03-29 9:56:06',
    value: 4.8
}, {
    timestamp: '2016-03-29 9:55:04',
    value: 4.7
}, {
    timestamp: '2016-03-29 9:54:04',
    value: 4.7
}, {
    timestamp: '2016-03-29 9:53:04',
    value: 4.7
}, {
    timestamp: '2016-03-29 9:52:04',
    value: 7.6
}, {
    timestamp: '2016-03-29 9:51:06',
    value: 4.5
}, {
    timestamp: '2016-03-29 9:50:03',
    value: 4
}];

class DashboardController {
    constructor($scope, instancesStore, sessionStore) {
        'ngInject';

        const onChange = () => {
            this.namespace = this._sessionStore.getActiveNamespace();
            this._getData();
        };

        this.mockDataCPU = mockDataCPU;
        this.mockDataMemory = mockDataMemory;

        this._sessionStore = sessionStore;
        this._instancesStore = instancesStore;
        this.namespace = this._sessionStore.getActiveNamespace();
        this._sessionStore.addNamespaceChangeListener(onChange);
        this._getData();
        $scope.$on('$destroy', () => this._sessionStore.removeNamespaceChangeListener(onChange));
    }

    _getData() {
        const instances = this._instancesStore.getAll(this.namespace.name);

        this.statistics = {};
        instances.forEach((instance) => {
            switch (instance.kind) {
                case 'Service':
                    if (_.isUndefined(this.statistics.services)) {
                        this.statistics.services = {
                            total: 0
                        };
                    }
                    this.statistics.services.total++;
                    break;

                case 'ReplicationController':
                    if (_.isUndefined(this.statistics.replicationControllers)) {
                        this.statistics.replicationControllers = {
                            total: 0,
                            replicas: 0
                        };
                    }
                    this.statistics.replicationControllers.total++;
                    this.statistics.replicationControllers.replicas += _.get(instance, 'spec.replicas', 0);
                    break;

                case 'Pod':
                    if (_.isUndefined(this.statistics.pods)) {
                        this.statistics.pods = {
                            total: 0,
                            containers: {
                                total: 0,
                                containerTypes: new Set()
                            }

                        };
                    }
                    this.statistics.pods.total++;
                    this.statistics.pods.containers = _.chain(instance).get('spec.containers', []).reduce((result, container) => {
                        result.total++;
                        result.containerTypes.add(container.image);
                        return result;
                    }, this.statistics.pods.containers).value();
                    break;

                default:
                    break;
            }
        });
    }
}

export default DashboardController;

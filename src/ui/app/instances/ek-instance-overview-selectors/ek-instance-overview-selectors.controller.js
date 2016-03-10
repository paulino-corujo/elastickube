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

class InstanceOverviewSelectorsController {
    constructor($scope, instanceStore, instancesStore, sessionStore) {
        'ngInject';

        const onInstanceChange = () => {
            this.instance = instanceStore.getInstance();
            this.selectedInstances = getSelectedInstances(this.instance,
                instancesStore.getAll(sessionStore.getActiveNamespace().metadata.name));
        };
        const onInstancesChange = () => {
            this.selectedInstances = getSelectedInstances(this.instance,
                instancesStore.getAll(sessionStore.getActiveNamespace().metadata.name));
        };

        this.instance = instanceStore.getInstance();
        this.selectedInstances = getSelectedInstances(this.instance,
            instancesStore.getAll(sessionStore.getActiveNamespace().metadata.name));

        instanceStore.addChangeListener(onInstanceChange);
        instancesStore.addChangeListener(onInstancesChange);

        $scope.$on('$destroy', () => {
            instanceStore.removeChangeListener(onInstanceChange);
            instancesStore.removeChangeListener(onInstancesChange);
        });
    }

    containsLabel(name, value) {
        const selector = _.get(this.instance, 'spec.selector');

        return selector[name] === value;
    }
}

function getSelectedInstances(instance, instances) {
    const selector = _.get(instance, 'spec.selector');

    return _.chain(instances)
        .filter((x) => {
            return x.kind === (instance.kind === 'Service' ? 'ReplicationController' : 'Pod')
                && _.isEqual(selector, _.pick(x.metadata.labels, _.keys(selector)));
        })
        .value();
}

export default InstanceOverviewSelectorsController;

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

import moment from 'moment';

class InstanceOverviewDetailsController {
    constructor($scope, instanceStore, instancesStore) {
        'ngInject';

        const onChange = () => {
            this.instance = instanceStore.getInstance();
        };

        this._instancesStore = instancesStore;

        this.instance = instanceStore.getInstance();

        instanceStore.addChangeListener(onChange);

        if (_.has(this.instance, 'status.replicas')) {
            this.details = this._createReplicationControllerDetails();
        } else {
            this.details = this._createPodDetails();
        }

        $scope.$on('$destroy', () => instanceStore.removeChangeListener(onChange));
    }

    _createPodDetails() {
        const details = {};

        details.Kind = this.instance.kind;
        details['Image(s)'] = _.chain(this.instance.spec.containers).map((x) => x.image).join(', ').value();
        details.Node = this.instance.spec.nodeName;
        details['Start Time'] = moment.utc(this.instance.metadata.creationTimestamp).local().format('ddd, D MMM GGGG HH:mm:ss');
        details['IP(s)'] = this.instance.status.podIP;

        return _.omitBy(details, _.isEmpty);
    }

    _createReplicationControllerDetails() {
        const details = {};
        const pods = getPods(this.instance, this._instancesStore.getAll());

        details.Kind = this.instance.kind;
        details['Image(s)'] = _.chain(this.instance.spec.template.spec.containers).map((x) => x.image).join(', ').value();
        details.Node = _.chain(pods).map((x) => x.spec.nodeName).uniq().join('/').value();
        details['Start Time'] = moment.utc(this.instance.metadata.creationTimestamp).local().format('ddd, D MMM GGGG HH:mm:ss');
        details['IP(s)'] = _.chain(pods).map((x) => x.status.podIP).uniq().join('/').value();

        return _.omitBy(details, _.isEmpty);
    }
}

function getPods(instance, instances) {
    return _.chain(instances)
        .filter((x) => {
            if (_.has(x, ['metadata', 'annotations', 'kubernetes.io/created-by'])) {
                const createdBy = JSON.parse(x.metadata.annotations['kubernetes.io/created-by']);

                return createdBy.reference.uid === instance.metadata.uid;
            }

            return false;
        })
        .flatMap((x) => [x].concat(getPods(x, instances)))
        .value();
}

export default InstanceOverviewDetailsController;

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

class InstanceFiltersController {
    constructor($scope) {
        'ngInject';

        this.instancesFilteredByState = [];
        this.selectedOwners = [];
        this.filteredInstances = [];

        $scope.$watch('ctrl.selectedState', () => this.filterInstancesByState());
        $scope.$watchCollection('ctrl.instancesToFilter', () => this.filterInstancesByState());

        $scope.$watchCollection('ctrl.selectedOwners', () => this.filterInstancesByOwners());
        $scope.$watchCollection('ctrl.instancesFilteredByState', () => this.filterInstancesByOwners());
    }

    filterInstancesByState() {
        this.instancesFilteredByState = _.chain(this.instancesToFilter)
            .filter((x) => {
                return _.isUndefined(this.selectedState) || this.selectedState.state.kind === 'all'
                    || this.selectedState.state.kind.toLowerCase() === (x.kind || '').toLowerCase()
                    && _.isUndefined(this.selectedState.substate) || !_.isUndefined(this.selectedState.substate)
                    && _.get(x, 'status.phase') === this.selectedState.substate.state;
            })
            .value();
    }

    filterInstancesByOwners() {
        this.filteredInstances = _.isEmpty(this.selectedOwners)
            ? this.instancesFilteredByState
            : _.filter(this.instancesFilteredByState, (x) => _.includes(this.selectedOwners, x.owner));
    }
}

export default InstanceFiltersController;

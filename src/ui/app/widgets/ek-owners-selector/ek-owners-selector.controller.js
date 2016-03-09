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

class OwnersSelectorController {
    constructor($scope, usersStore) {
        'ngInject';

        this._userStore = usersStore;

        this.selectedOwners = this.selectedOwners || [];
        this.open = true;

        $scope.$watchCollection('ctrl.shareables', (x) => {
            this.owners = getOwners(x);
            this.selectedOwners = _.filter(this.selectedOwners, (y) => !!_.find(this.owners, { id: y }));
        });
    }

    toggleOpen() {
        this.open = !this.open;
    }

    isOwnerSelected(owner) {
        return _.includes(this.selectedOwners, owner.id);
    }

    toggleSelectedOwner(owner) {
        if (this.isOwnerSelected(owner)) {
            this.selectedOwners = _.without(this.selectedOwners, owner.id);
        } else {
            this.selectedOwners = this.selectedOwners.concat(owner.id);
        }
    }
}

function getOwners(shareables) {
    return _.chain(shareables)
        .map((x) => _.find(this._userStore.getAll(), { id: x.owner }))
        .uniq()
        .sortBy('id')
        .value();
}

export default OwnersSelectorController;

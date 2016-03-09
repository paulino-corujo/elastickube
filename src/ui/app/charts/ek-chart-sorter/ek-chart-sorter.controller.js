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

class ChartSorterController {
    constructor($scope, usersStore) {
        'ngInject';

        this._userStore = usersStore;

        this.sortTypes = ['name', 'most recent'];
        this.sortType = _.first(this.sortTypes);

        $scope.$watch('ctrl.sortType', (x) => this.sortedCollection = sortByType(this.collectionToSort, x));
        $scope.$watchCollection('ctrl.collectionToSort', (x) => this.sortedCollection = sortByType(x, this.sortType));
    }
}

function sortByType(collectionToSort, sortType) {
    switch (sortType) {
        case 'name':
            return sortByName(collectionToSort);
        case 'owner':
            return sortByOwner(collectionToSort);
        default:
            return sortByMostRecent(collectionToSort);
    }
}

function sortByName(collectionToSort) {
    return _.orderBy(collectionToSort, 'name');
}

function sortByMostRecent(collectionToSort) {
    return _.orderBy(collectionToSort, 'created');
}

function sortByOwner(collectionToSort) {
    return _.sortBy(collectionToSort, (x) => _.find(this._userStore.getAll(), { id: x.owner }).name);
}

export default ChartSorterController;

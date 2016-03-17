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

class TableController {
    constructor($scope, $compile) {
        'ngInject';

        this._$scope = $scope;

        const defaultOptions = {
            enableSelection: false,
            getIdentity: (x) => _.indexOf(this.items, x)
        };
        const defaultColumnDef = {
            name: '',
            enableSorting: true
        };

        this._initStatus(this.status);

        this.options = _.extend({}, defaultOptions, this.inputOptions);
        this.options.columnDefs = _.map(this.options.columnDefs, (x) => {
            const columnDef = _.extend({}, defaultColumnDef, x);

            if (angular.isDefined(columnDef.cellTemplate)) {
                columnDef.compiledTemplateFn = $compile(columnDef.cellTemplate);
            }

            return columnDef;
        });

        if (angular.isString(this.options.data)) {
            $scope.$parent.$watchCollection(this.options.data, () => this._setItems());
        } else {
            $scope.$watch.$watchCollection(() => this.options.data, () => this._setItems());
        }
    }

    getColumnStyle(columnDef) {
        const styles = {};

        if (angular.isDefined(columnDef.width)) {
            styles.width = columnDef.width;
        } else {
            styles.flex = 1;
        }

        return styles;
    }

    sortByColumn(columnDef) {
        this.options.columnDefs.forEach((x) => {
            if (x === columnDef) {
                switch (x.sortOrder) {
                    case 'asc':
                        x.sortOrder = 'desc';
                        break;
                    case 'desc':
                        delete x.sortOrder;
                        break;
                    default:
                        x.sortOrder = 'asc';
                }
            } else {
                delete x.sortOrder;
            }
        });

        this._setItems();
    }

    isAllSelected() {
        return this.allSelected;
    }

    toggleSelectAll() {
        if (this.isAllSelected()) {
            this._status.selection = [];
        } else {
            this._status.selection = _.map(this.items, (x) => this.options.getIdentity(x));
        }

        this._setItems();
    }

    isSelected(item) {
        return _.includes(this._status.selection, this.options.getIdentity(item));
    }

    toggleSelected(item) {
        const id = this.options.getIdentity(item);

        this._status.selection = _.includes(this._status.selection, id)
            ? _.without(this._status.selection, id)
            : this._status.selection.concat(id);

        this._setItems();
    }

    existsGroups() {
        return angular.isDefined(this.options.groupField) && !_.chain(this.groups)
            .keys()
            .compact()
            .isEmpty()
            .value();
    }

    isAllCollapsed() {
        return _.chain(this.groups)
            .values()
            .every()
            .value();
    }

    toggleGroupAll() {
        if (this.isAllCollapsed()) {
            this._status.grouping = [];
        } else {
            this._status.grouping = _.keys(this.groups);
        }

        this._setItems();
    }

    isCollapsed(item) {
        return angular.isDefined(item._groupParent) && _.includes(this._status.grouping, this.options.getIdentity(item));
    }

    isExpanded(item) {
        return angular.isDefined(item._groupParent) && !_.includes(this._status.grouping, this.options.getIdentity(item));
    }

    toggleGroup(item) {
        if (angular.isDefined(item._groupParent)) {
            const id = this.options.getIdentity(item);

            this._status.grouping = _.includes(this._status.grouping, id)
                ? _.without(this._status.grouping, id)
                : this._status.grouping.concat(id);

            this._setItems();
        }
    }

    _initStatus(status = {}) {
        status.selection = status.selection || [];
        status.grouping = status.grouping || [];

        this._status = status;
    }

    _setItems() {
        let items = angular.copy(angular.isString(this.options.data)
            ? _.get(this._$scope.$parent, this.options.data)
            : this.options.data);

        items = this._sortItems(items);
        items = this._flatGroups(items);

        this._updateSelections(items);
        this._updateGroups(items);

        this.items = items;
        this._$scope.$emit('ek-table.status-updated', this._status);
    }

    _sortItems(itemsToSort) {
        const sorterColumn = _.find(this.options.columnDefs, (x) => angular.isDefined(x.sortOrder));
        let items = itemsToSort;

        function sortByColumn(collection, columnDef) {
            if (angular.isDefined(columnDef.sortingAlgorithm)) {
                collection.sort((a, b) => {
                    const result = columnDef.sortingAlgorithm(a, b);

                    return columnDef.sortOrder === 'asc' ? result : result * -1;
                });
            } else {
                return _.orderBy(collection, [columnDef.field], [columnDef.sortOrder]);
            }

            return collection;
        }

        if (sorterColumn && sorterColumn.enableSorting && angular.isDefined(sorterColumn.field)) {
            items = sortByColumn(items, sorterColumn);

            if (angular.isDefined(this.options.groupField)) {
                items = _.chain(items)
                    .map((x) => {
                        const childNodes = x[this.options.groupField];

                        if (_.size(childNodes) > 1) {
                            x[this.options.groupField] = sortByColumn(x[this.options.groupField], sorterColumn);
                        }

                        return x;
                    })
                    .value();
            }
        }

        return items;
    }

    _flatGroups(items) {
        if (angular.isDefined(this.options.groupField)) {
            return _.chain(items)
                .map((x) => {
                    if (!_.isEmpty(x[this.options.groupField])) {
                        const id = this.options.getIdentity(x);

                        x._groupParent = true;
                        if (!_.includes(this._status.grouping, id)) {
                            return [x].concat(_.map(x[this.options.groupField], (y) => {
                                y._groupChild = true;

                                return y;
                            }));
                        }
                    }

                    return x;
                })
                .flatten()
                .value();
        }

        return items;
    }

    _updateGroups(items) {
        this.groups = _.reduce(items, (memo, x) => {
            if (angular.isDefined(x._groupParent)) {
                const id = this.options.getIdentity(x);

                memo[id] = _.includes(this._status.grouping, id);
            }

            return memo;
        }, {});

        this._status.grouping = _.chain(this.groups)
            .keys()
            .filter((x) => this.groups[x])
            .value();
    }

    _updateSelections(items) {
        this.allSelected = _.chain(items)
            .map((x) => this.options.getIdentity(x))
            .without(...this._status.selection)
            .isEmpty()
            .value();

        this._status.selection = _.chain(this._status.selection)
            .filter((x) => _.find(items, (y) => this.options.getIdentity(y) === x))
            .value();
    }
}

export default TableController;

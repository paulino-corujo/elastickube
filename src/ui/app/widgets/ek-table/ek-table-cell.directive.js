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

class TableCellDirective {
    constructor() {
        this.scope = {
            column: '=',
            item: '='
        };
    }

    compile(tElement) {
        tElement.addClass('ek-table-cell');

        return {
            pre: ($scope, $element) => {
                $scope.appScope = $scope.$parent.ctrl._$scope.$parent;

                if (angular.isDefined($scope.column.compiledTemplateFn)) {
                    $scope.column.compiledTemplateFn($scope, (clonedElement) => $element.append(clonedElement));
                } else if (_.has($scope.column, 'field')) {
                    $element.append(_.get($scope.item, $scope.column.field));
                }
            }
        };
    }
}

export default TableCellDirective;

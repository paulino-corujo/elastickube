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

const NEW_INSTANCE_STEP = 2;

class CustomizeDeploymentController {
    constructor($scope, $element) {
        'ngInject';

        this._$element = $element;
        this.deploymentInfo = {
            labels: []
        };

        $scope.$watch('ctrl.deploymentInfo', (deploymentInfo) => {
            this.parentController.deploymentInfo = deploymentInfo;
        }, true);

        $scope.$watch('ctrl.step', (step) => {
            if (step === NEW_INSTANCE_STEP) {
                this.parentController.deploymentInfo = this.deploymentInfo;
                this._$element.addClass('ek-customize-deployment--active');
            } else {
                delete this.parentController.deploymentInfo;
                this._$element.removeClass('ek-customize-deployment--active');
            }
        });
    }

    setLabels() {
        return (labels) => this.deploymentInfo.labels = labels;
    }
}

export default CustomizeDeploymentController;

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
}

export default CustomizeDeploymentController;

class NewInstanceController {
    constructor(instancesActionCreator, instancesNavigationActionCreator) {
        'ngInject';

        this._instancesActionCreator = instancesActionCreator;
        this._instancesNavigationActionCreator = instancesNavigationActionCreator;

        this.step = 1;
    }

    chartSelected() {
        return (chart) => {
            this.selectedChart = chart;
            this.step++;
        };
    }

    editChart() {
        this.step = 1;
    }

    isDisabled() {
        return _.isUndefined(this.selectedChart) || _.isUndefined(this.deploymentInfo) || !this.form.$valid;
    }

    deploy() {
        this._instancesActionCreator.deploy(this.selectedChart, this.deploymentInfo)
            .then(() => {
                this._instancesNavigationActionCreator.instances();
            });
    }
}

export default NewInstanceController;

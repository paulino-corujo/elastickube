class NewInstanceController {
    constructor(instancesActionCreator, instancesNavigationActionCreator, sessionStore) {
        'ngInject';

        this._instancesActionCreator = instancesActionCreator;
        this._instancesNavigationActionCreator = instancesNavigationActionCreator;
        this._sessionStore = sessionStore;

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
        return _.isUndefined(this.selectedChart) || _.isUndefined(this.deploymentInfo);
    }

    goToInstances() {
        return this._instancesNavigationActionCreator.instances();
    }

    deploy() {
        this._instancesActionCreator.deploy(this._sessionStore.getActiveNamespace(), this.selectedChart, this.deploymentInfo)
            .then(() => {
                this.goToInstances();
            }, () => {
                this.goToInstances();

                // FIXME we should show an error message here
            });
    }
}

export default NewInstanceController;

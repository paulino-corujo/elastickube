class InstanceContainerChartController {
    constructor() {
        'ngInject';

        this.dataset = [{ cpu: Math.floor(Math.random() * 100) + 1 }, { memory: Math.floor(Math.random() * 100) + 1 }];
    }
}

export default InstanceContainerChartController;

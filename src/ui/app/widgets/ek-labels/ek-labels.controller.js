class InstanceLabelsController {
    constructor() {
        'ngInject';
    }

    countLabels() {
        return _.size(this.labels);
    }
}

export default InstanceLabelsController;

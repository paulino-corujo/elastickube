class InstanceLabelsController {
    constructor() {
        'ngInject';
    }

    countLabels() {
        return _.size(this.instance.metadata.labels);
    }
}

export default InstanceLabelsController;

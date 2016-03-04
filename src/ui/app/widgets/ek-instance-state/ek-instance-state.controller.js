class InstanceStateController {
    constructor() {
    }

    getInstanceState() {
        return _.get(this.instance, 'status.phase');
    }
}

export default InstanceStateController;

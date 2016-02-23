class InstanceStateController {
    constructor() {
    }

    getInstanceState() {
        return this.instance.status.phase;
    }
}

export default InstanceStateController;

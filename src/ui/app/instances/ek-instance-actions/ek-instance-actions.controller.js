class InstanceActionsController {
    constructor(instancesActionCreator) {
        'ngInject';

        this._instancesActionCreator = instancesActionCreator;
    }

    delete() {
        this.drop.close();
        this._instancesActionCreator.delete(this.instance);
    }
}

export default InstanceActionsController;

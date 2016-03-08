class InstanceActionsController {
    constructor($scope, confirmDialog, instancesActionCreator) {
        'ngInject';

        this._$scope = $scope;
        this._confirmDialog = confirmDialog;
        this._instancesActionCreator = instancesActionCreator;
    }

    delete() {
        this.drop.close();
        return this._confirmDialog
            .confirm(this._$scope, {
                title: 'Confirm Action',
                content: `Do you want to DELETE ${this.instance.metadata.name} instance?`,
                ok: 'OK',
                cancel: 'CANCEL'
            })
            .then(() => {
                 return this._instancesActionCreator.delete(this.instance);
            });
    }
}

export default InstanceActionsController;

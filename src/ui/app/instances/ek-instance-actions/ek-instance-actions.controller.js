class InstanceActionsController {
    constructor($scope, ekConfirmDialog, instancesActionCreator) {
        'ngInject';

        this._$scope = $scope;
        this._ekConfirmDialog = ekConfirmDialog;
        this._instancesActionCreator = instancesActionCreator;
    }

    delete() {
        this.drop.close();
        return this._ekConfirmDialog.confirm(this._$scope, {
            title: 'Confirm Action',
            content: `Do you want to DELETE ${this.instance.metadata.name} instance?`,
            ok: 'OK',
            cancel: 'CANCEL'
        }).then(() => {
            this._instancesActionCreator.delete(this.instance);
        });
    }
}

export default InstanceActionsController;

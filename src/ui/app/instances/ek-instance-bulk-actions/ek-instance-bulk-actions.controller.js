class InstanceActionsController {
    constructor($q, $scope, ekConfirmDialog, instancesActionCreator) {
        'ngInject';

        this._$q = $q;
        this._$scope = $scope;
        this._ekConfirmDialog = ekConfirmDialog;
        this._instancesActionCreator = instancesActionCreator;
    }

    delete() {
        this.drop.close();

        const instanceNames = _.chain(this.instances)
            .map((x) => x.metadata.name)
            .value()
            .join(', ');

        return this._ekConfirmDialog
            .confirm(this._$scope, {
                title: 'Confirm Action',
                content: `Do you want to DELETE ${instanceNames} instance${_.size(this.instances) > 1 ? 's' : ''}?`,
                ok: 'OK',
                cancel: 'CANCEL'
            })
            .then(() => {
                return this._$q.all(this.instances.map((x) => this._instancesActionCreator.delete(x)));
            });
    }
}

export default InstanceActionsController;

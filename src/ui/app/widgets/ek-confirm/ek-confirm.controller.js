class ConfirmController {
    constructor($mdDialog, $scope) {
        'ngInject';

        this.options = $scope.$parent.options;
        this._$mdDialog = $mdDialog;
    }

    isCancelButtonAvailable() {
        return this.options.cancelButton || _.isUndefined(this.options.cancelButton);
    }

    isOKButtonAvailable() {
        return this.options.okButton || _.isUndefined(this.options.okButton);
    }

    cancel() {
        this._$mdDialog.cancel();
    }

    ok() {
        this._$mdDialog.hide();
    }
}

export default ConfirmController;

class ConfirmController {
    constructor($q, $mdDialog, $scope) {
        'ngInject';

        this._$q = $q;
        this._$mdDialog = $mdDialog;
        this.options = $scope.$parent.options;
        this.canAccept = true;
    }

    isCancelButtonAvailable() {
        return this.options.cancelButton || _.isUndefined(this.options.cancelButton);
    }

    isOKButtonAvailable() {
        return this.options.okButton || _.isUndefined(this.options.okButton);
    }

    addOnAcceptListener(acceptListener) {
        this._acceptListener = acceptListener;
    }

    cancel() {
        this._$mdDialog.cancel();
    }

    ok() {
        return this._$q.when(this._acceptListener && this._acceptListener.accept())
            .then(() => this._$mdDialog.hide())
            .catch((error) => {
                this._$mdDialog.hide();

                // FIXME show message error and remove hide() call
                console.error(error);
            });
    }
}

export default ConfirmController;

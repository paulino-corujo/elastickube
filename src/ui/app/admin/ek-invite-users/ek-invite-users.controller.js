class InviteUsersController {
    constructor($mdDialog) {
        'ngInject';

        this._$mdDialog = $mdDialog;

        this.emails = [];
        this.note = '';
    }

    cancel() {
        this._$mdDialog.hide();
    }

    send() {
        this.cancel();
    }
}

export default InviteUsersController;

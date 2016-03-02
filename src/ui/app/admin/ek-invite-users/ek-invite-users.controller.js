class InviteUsersController {
    constructor($mdDialog, usersActionCreator) {
        'ngInject';

        this._$mdDialog = $mdDialog;
        this._usersActionCreator = usersActionCreator;

        this.emails = [];
        this.note = '';
    }

    cancel() {
        this._$mdDialog.hide();
    }

    send() {
        this._usersActionCreator.invite({ emails: this.emails, note: this.note });
        this.cancel();
    }
}

export default InviteUsersController;

class NavigationActionCreatorService {
    constructor($mdDialog, confirmDialog, routerHelper, sessionStore) {
        'ngInject';

        this._$mdDialog = $mdDialog;
        this._confirmDialog = confirmDialog;
        this._routerHelper = routerHelper;
        this._sessionStore = sessionStore;
    }

    settings(stateOptions) {
        return this._routerHelper.changeToState('admin.settings', stateOptions);
    }

    users() {
        return this._routerHelper.changeToState('admin.users');
    }

    namespaces() {
        return this._routerHelper.changeToState('admin.namespaces');
    }

    charts() {
        return this._routerHelper.changeToState('admin.charts');
    }

    instances() {
        return this._routerHelper.changeToState('admin.instances');
    }

    warnOutboundEmailDisabled($scope) {
        return this._confirmDialog.confirm($scope, {
            title: 'Outbound email is turned off',
            content: 'An outbound email server and no reply address must be specified in order to send invites.',
            ok: 'TURN ON',
            cancel: 'NOT NOW'
        }).then(() => {
            return this.settings({ focusSection: 'email' });
        });
    }

    inviteUsers() {
        return this._$mdDialog.show({
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            openFrom: 'left',
            closeTo: 'right',
            disableParentScroll: true,
            template: '<ek-invite-users></ek-invite-users>'
        });
    }
}

export default NavigationActionCreatorService;

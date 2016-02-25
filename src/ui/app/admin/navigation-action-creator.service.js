class NavigationActionCreatorService {
    constructor($mdDialog, routerHelper, sessionStore) {
        'ngInject';

        this._$mdDialog = $mdDialog;
        this._routerHelper = routerHelper;
        this._sessionStore = sessionStore;
    }

    settings() {
        return this._routerHelper.changeToState('admin.settings');
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

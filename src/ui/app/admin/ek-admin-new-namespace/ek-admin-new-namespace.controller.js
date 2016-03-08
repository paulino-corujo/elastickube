class AdminNewNamespaceController {
    constructor($scope, principalStore, namespacesActionCreator) {
        'ngInject';

        this._namespacesActionCreator = namespacesActionCreator;
        this._principalStore = principalStore;

        $scope.$watchGroup(['ctrl.form.$valid', 'ctrl.users'], (values) => {
            this.dialogController.canAccept = values[0] && values[1].length > 0;
        });

        this.users = [principalStore.getPrincipal()];
    }

    removeUser(user) {
        this.users = _.without(this.users, user);
    }

    accept() {
        return this._namespacesActionCreator.createNamespace(this.namespaceName, this.users);
    }
}

export default AdminNewNamespaceController;

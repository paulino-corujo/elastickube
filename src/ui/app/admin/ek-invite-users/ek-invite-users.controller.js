class InviteUsersController {
    constructor($scope, $mdDialog, namespacesStore, usersActionCreator) {
        'ngInject';

        const onChange = () => this.namespaces = namespacesStore.getAll();

        this._$mdDialog = $mdDialog;
        this._usersActionCreator = usersActionCreator;

        this.namespaces = namespacesStore.getAll();
        this.selectedNamespaces = [];
        this.emails = [];
        this.note = '';

        namespacesStore.addChangeListener(onChange);

        $scope.$on('$destroy', () => namespacesStore.removeChangeListener(onChange));
    }

    toggleSelection(namespace) {
        if (_.includes(this.selectedNamespaces, namespace.metadata.name)) {
            this.selectedNamespaces = _.without(this.selectedNamespaces, namespace.metadata.name);
        } else {
            this.selectedNamespaces = this.selectedNamespaces.concat(namespace.metadata.name);
        }
    }

    cancel() {
        this._$mdDialog.hide();
    }

    send() {
        this._usersActionCreator.invite({ emails: this.emails, note: this.note, namespaces: this.selectedNamespaces });
        this.cancel();
    }
}

export default InviteUsersController;

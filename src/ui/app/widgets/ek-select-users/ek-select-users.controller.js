class SelectUsersController {
    constructor(usersStore) {
        'ngInject';

        this._usersStore = usersStore;
    }

    selectUser(user) {
        if (!_.isUndefined(user)) {
            this.selectedUsers = this.selectedUsers.concat(user.id);
            delete this.selectedUser;
            delete this.searchText;
        }
    }

    querySearch(text) {
        return _.chain(this._usersStore.getAll())
            .reject((x) => _.includes(this.selectedUsers, x.id))
            .filter((x) => x.name.indexOf(text) !== -1)
            .value();
    }
}

export default SelectUsersController;

class SelectUsersController {
    constructor(usersStore) {
        'ngInject';

        this._usersStore = usersStore;
    }

    selectUser(user) {
        if (!_.isUndefined(user)) {
            this.selectedUsers = this.selectedUsers.concat(user.username);
            delete this.selectedUser;
            delete this.searchText;
        }
    }

    querySearch(text) {
        return _.chain(this._usersStore.getAll())
            .reject((x) => _.includes(this.selectedUsers, x.id))
            .filter((x) => `${x.firstname} ${x.lastname}`.toLowerCase().indexOf((text || '').toLowerCase()) !== -1)
            .value();
    }
}

export default SelectUsersController;

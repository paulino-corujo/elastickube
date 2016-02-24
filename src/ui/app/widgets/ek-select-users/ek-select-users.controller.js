class SelectUsersController {
    constructor(usersStore) {
        'ngInject';

        this._usersStore = usersStore;
    }

    selectUser(user) {
        if (!_.isUndefined(user)) {
            this.selectedUsers = _.chain(this.selectedUsers)
                .concat(user)
                .sortBy((x) => `${x.firstname} ${x.lastname}`.toLowerCase())
                .value();

            delete this.selectedUser;
            delete this.searchText;
        }
    }

    querySearch(text) {
        return _.chain(this._usersStore.getAll())
            .reject((x) => _.includes(this.selectedUsers, x))
            .filter((x) => `${x.firstname} ${x.lastname}`.toLowerCase().indexOf((text || '').toLowerCase()) !== -1)
            .value();
    }
}

export default SelectUsersController;

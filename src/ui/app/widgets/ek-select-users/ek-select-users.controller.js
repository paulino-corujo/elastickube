/*
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
            .reject((x) => _.includes(this.selectedUsers, x) || _.isUndefined(x.email_validated_at))
            .filter((x) => `${x.firstname} ${x.lastname}`.toLowerCase().indexOf((text || '').toLowerCase()) !== -1)
            .value();
    }
}

export default SelectUsersController;

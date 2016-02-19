class UserInfoController {
    constructor(usersStore) {
        'ngInject';

        this.user = usersStore.get(this.userId);
        this.showUserId = this.showId && this.showId.toLowerCase() === 'true';
    }
}

export default UserInfoController;

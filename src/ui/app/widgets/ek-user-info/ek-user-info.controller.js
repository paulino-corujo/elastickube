class UserInfoController {
    constructor($scope, usersStore) {
        'ngInject';

        this.showUserId = this.showId && this.showId.toLowerCase() === 'true';

        $scope.$watch('ctrl.userId', (x) => this.user = usersStore.get(x));
    }
}

export default UserInfoController;

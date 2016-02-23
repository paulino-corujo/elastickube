class UserInfoController {
    constructor($scope, usersStore) {
        'ngInject';

        this.show = this.showUsername && this.showUsername.toLowerCase() === 'true';

        $scope.$watch('ctrl.username', (x) => this.user = usersStore.get(x));
    }
}

export default UserInfoController;

class LoginController {
    constructor($scope, login, principalActionCreator) {
        'ngInject';

        this._$scope = $scope;
        this._login = login;
        this._principalActionCreator = principalActionCreator;
    }

    submit() {
        this._principalActionCreator.login(this.user)
            .then(() => this._login.execute())
            .catch(() => console.warn('Invalid User or Password.'));
    }
}

export default LoginController;

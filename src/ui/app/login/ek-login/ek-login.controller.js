class LoginController {
    constructor($scope, initialization, login, principalActionCreator) {
        'ngInject';

        this._$scope = $scope;
        this._initialization = initialization;
        this._login = login;
        this._principalActionCreator = principalActionCreator;
    }

    submit() {
        this._principalActionCreator.login(this._$scope.user)
            .then(() => this._initialization.execute())
            .then(() => this._login.execute())
            .catch(() => console.warn('Invalid User or Password.'));
    }
}

export default LoginController;

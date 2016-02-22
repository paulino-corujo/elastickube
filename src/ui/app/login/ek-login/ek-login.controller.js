class LoginController {
    constructor($scope, login, principalActionCreator) {
        'ngInject';

        this._$scope = $scope;
        this._login = login;
        this._principalActionCreator = principalActionCreator;
    }

    submit() {
        this._principalActionCreator.login(this._$scope.user)
            .then(() => this._login.execute())
            .catch((response) => {
                console.log(response);
                console.warn('Invalid User or Password.');
            });
    }
}

export default LoginController;

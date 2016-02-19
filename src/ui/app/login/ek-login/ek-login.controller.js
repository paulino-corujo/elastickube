class LoginController {
    constructor($scope, initialization, principalActionCreator) {
        'ngInject';

        this._$scope = $scope;
        this._initialization = initialization;
        this._principalActionCreator = principalActionCreator;
    }

    submit() {
        this._principalActionCreator.login(this._$scope.user)
            .then(() => this._initialization.execute())
            .catch(() => console.warn('Invalid User or Password.'));
    }
}

export default LoginController;

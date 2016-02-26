class LoginController {
    constructor($scope, initialization, instancesNavigationActionCreator, principalActionCreator) {
        'ngInject';

        this._$scope = $scope;
        this._initialization = initialization;
        this._instancesNavigationActionCreator = instancesNavigationActionCreator;
        this._principalActionCreator = principalActionCreator;
    }

    submit() {
        return this._principalActionCreator.login(this.user)
            .then(() => this._initialization.initializeLoggedInUser())
            .then(() => this._instancesNavigationActionCreator.instances())
            .catch(() => console.warn('Invalid User or Password.'));
    }
}

export default LoginController;

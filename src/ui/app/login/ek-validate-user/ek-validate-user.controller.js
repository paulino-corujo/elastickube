import constants from 'constants';

class SignupController {
    constructor($scope, $stateParams, initialization, instancesNavigationActionCreator, principalActionCreator) {
        'ngInject';

        this._$scope = $scope;
        this._initialization = initialization;
        this._instancesNavigationActionCreator = instancesNavigationActionCreator;
        this._principalActionCreator = principalActionCreator;
        this._code = $stateParams.code;

        $scope.user = {
            email: this.authProviders.email
        };
    }

    submit() {
        return this._principalActionCreator.signup(this._$scope.user, this._code)
            .then(() => this._initialization.initializeLoggedInUser())
            .then(() => this._instancesNavigationActionCreator.instances())
            .catch((response) => {
                switch (response.status) {
                    case constants.httpStatusCode.BAD_REQUEST:
                        console.error('BAD REQUEST: Invalid field');
                        break;
                    case constants.httpStatusCode.FORBIDDEN:
                        console.warn('FORBIDDEN: An admin user was already created');
                        break;
                    default:
                }
            });
    }
}

export default SignupController;

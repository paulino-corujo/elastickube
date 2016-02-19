import constants from 'constants';

class SignupController {
    constructor($scope, initialization, principalActionCreator) {
        'ngInject';

        this._$scope = $scope;
        this._initialization = initialization;
        this._principalActionCreator = principalActionCreator;
    }

    submit() {
        this._principalActionCreator.signup(this._$scope.user)
            .then(() => this._initialization.execute())
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

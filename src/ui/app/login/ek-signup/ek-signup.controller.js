import constants from 'constants';

class SignupController {
    constructor($scope, initialization, login, principalActionCreator) {
        'ngInject';

        this._$scope = $scope;
        this._initialization = initialization;
        this._login = login;
        this._principalActionCreator = principalActionCreator;
    }

    submit() {
        this._principalActionCreator.signup(this._$scope.user)
            .then(() => this._initialization.execute())
            .then(() => this._login.execute())
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

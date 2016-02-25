import constants from 'constants';

class SignupController {
    constructor($scope, $location, login, principalActionCreator) {
        'ngInject';

        this._$scope = $scope;
        this._login = login;
        this._principalActionCreator = principalActionCreator;

        if (hasValues(this.authProviders)) {
            this.validation = true;
            this._code = $location.hash();

            $scope.user = {
                email: this.authProviders.email
            };
        }
    }

    submit() {
        this._principalActionCreator.signup(this._$scope.user, this._code)
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

function hasValues(obj) {
    return !_.chain(obj)
        .values()
        .compact()
        .isEmpty()
        .value();
}

export default SignupController;

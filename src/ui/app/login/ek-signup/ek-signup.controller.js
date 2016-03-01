import constants from 'constants';
import defaultPasswordRegexString from 'text!../../../../api/resources/password_default_regex';

class SignupController {
    constructor($scope, adminNavigationActionCreator, initialization, principalActionCreator) {
        'ngInject';

        this._$scope = $scope;
        this._adminNavigationActionCreator = adminNavigationActionCreator;
        this._initialization = initialization;
        this._principalActionCreator = principalActionCreator;

        this.PASSWORD_REGEX = new RegExp(defaultPasswordRegexString.trim());
    }

    submit() {
        return this._principalActionCreator.signup(this._$scope.user)
            .then(() => this._initialization.initializeLoggedInUser())
            .then(() => this._adminNavigationActionCreator.settings())
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

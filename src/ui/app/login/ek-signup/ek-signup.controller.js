import constants from 'constants';

class SignupController {
    constructor($scope, namespacesActionCreator, namespacesStore, principalActionCreator, routerHelper, sessionActionCreator, sessionStore) {
        'ngInject';

        this._$scope = $scope;
        this._namespacesActionCreator = namespacesActionCreator;
        this._namespacesStore = namespacesStore;
        this._principalActionCreator = principalActionCreator;
        this._routerHelper = routerHelper;
        this._sessionActionCreator = sessionActionCreator;
        this._sessionStore = sessionStore;
    }

    submit() {
        this._principalActionCreator.signup(this._$scope.user)
            .then(() => {
                return this._namespacesActionCreator.load();
            })
            .then(() => {
                const namespace = _.chain(this._namespacesStore.getAll())
                    .first()
                    .value();

                return this._sessionActionCreator.selectNamespace(namespace);
            })
            .then(() => {
                const namespace = this._sessionStore.getActiveNamespace();

                this._routerHelper.changeToState(constants.pages.INSTANCES, { namespace });
            }, (response) => {
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

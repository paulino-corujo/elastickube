import constants from 'constants';
class LoginController {
    constructor($scope, namespacesActionCreator, namespacesStore,
                principalActionCreator, routerHelper, sessionActionCreator, sessionStore) {
        'ngInject';

        this._$scope = $scope;
        this._namespacesStore = namespacesStore;
        this._namespacesActionCreator = namespacesActionCreator;
        this._principalActionCreator = principalActionCreator;
        this._routerHelper = routerHelper;
        this._sessionActionCreator = sessionActionCreator;
        this._sessionStore = sessionStore;
    }

    submit() {
        this._principalActionCreator.login(this._$scope.user)
            .then(() => {
                return this._namespacesActionCreator.load();
            })
            .then(() => {
                let namespace = this._sessionStore.getActiveNamespace();

                if (_.isUndefined(namespace)) {
                    namespace = _.chain(this._namespacesStore.getAll())
                        .first()
                        .value();
                }
                return this._sessionActionCreator.selectNamespace(namespace);
            })
            .then(() => {
                const namespace = this._sessionStore.getActiveNamespace();

                this._routerHelper.changeToState(constants.pages.INSTANCES, { namespace });
            }, () => {
                console.warn('Invalid User or Password.');
            });
    }
}

export default LoginController;

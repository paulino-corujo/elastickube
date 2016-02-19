import constants from 'constants';

class LoginService {
    constructor(namespacesStore, routerHelper, sessionActionCreator, sessionStore) {
        'ngInject';

        this._namespacesStore = namespacesStore;
        this._routerHelper = routerHelper;
        this._sessionActionCreator = sessionActionCreator;
        this._sessionStore = sessionStore;
    }

    execute() {
        let namespace = this._sessionStore.getActiveNamespace();

        if (_.isUndefined(namespace)) {
            namespace = _.chain(this._namespacesStore.getAll())
                .first()
                .value();
        }

        return this._sessionActionCreator.selectNamespace(namespace)
            .then(() => this._routerHelper.changeToState(constants.pages.INSTANCES, { namespace }));
    }
}

export default LoginService;

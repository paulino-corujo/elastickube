class SignupService {
    constructor(initialization, instancesNavigationActionCreator, routerHelper, sessionStore) {
        'ngInject';

        this._initialization = initialization;
        this._instancesNavigationActionCreator = instancesNavigationActionCreator;
        this._routerHelper = routerHelper;
        this._sessionStore = sessionStore;
    }

    // TODO redirects to admin page when user has adminstrator role
    execute() {
        return this._initialization.initializeLoggedInUser()
            .then(() => this._instancesNavigationActionCreator.instances());
    }
}

export default SignupService;

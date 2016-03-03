class ApplicationLayoutController {
    constructor(auth, instancesNavigationActionCreator) {
        'ngInject';

        this._auth = auth;
        this._instancesNavigationActionCreator = instancesNavigationActionCreator;
    }

    isLoggedIn() {
        return this._auth.isLoggedIn();
    }

    goToInstances() {
        if (this._auth.isLoggedIn()) {
            return this._instancesNavigationActionCreator.instances();
        }
    }
}

export default ApplicationLayoutController;

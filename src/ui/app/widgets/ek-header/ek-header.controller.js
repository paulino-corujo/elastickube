class HeaderController {
    constructor($rootScope, $scope, auth, routerHelper, sessionStore, principalActionCreator, principalStore) {
        'ngInject';

        const watches = [];
        const onChange = () => {
            this.workspace = this._principalStore.getPrincipal();
            this.sections = getSections(auth, routerHelper);
        };

        this._auth = auth;
        this._routerHelper = routerHelper;
        this._sessionStore = sessionStore;
        this._principalActionCreator = principalActionCreator;
        this._principalStore = principalStore;

        this.sections = getSections(auth, routerHelper);
        this.workspace = this._principalStore.getPrincipal();

        this._principalStore.addPrincipalChangeListener(onChange);

        watches.concat([
            $rootScope.$on('$stateChangeSuccess', (event, toState) => {
                if (toState.data && toState.data.header) {
                    this.selectedState = _.find(this.sections, (x) => x.data.header.name === toState.data.header.name);
                }
            })
        ]);

        $scope.$on('$destroy', () => {
            this._principalStore.removePrincipalChangeListener(onChange);
            watches.forEach((x) => x());
        });
    }

    goToSection(section) {
        const namespace = this._sessionStore.getActiveNamespace();

        this._routerHelper.changeToState(section.name, { namespace: namespace.metadata.name });
    }

    isLoggedIn() {
        return this._auth.isLoggedIn();
    }

    logout() {
        this._principalActionCreator.logout()
            .then(() => {
                this._auth.logout();
            });
    }
}

function getSections(auth, routerHelper) {
    return _.chain(routerHelper.getStates())
        .filter(x => x.data && x.data.header && x.data.header.position && auth.authorize(x.data.access))
        .sort((x, y) => x.data.header.position - y.data.header.position)
        .value();
}

export default HeaderController;

class HeaderController {
    constructor($rootScope, $scope, $injector, $state, auth, routerHelper, sessionStore, principalStore) {
        'ngInject';

        const watches = [];
        const onChange = () => {
            this.workspace = this._principalStore.getPrincipal();
            this.sections = getSections(auth, routerHelper);
        };

        this._$injector = $injector;
        this._auth = auth;
        this._$state = $state;
        this._routerHelper = routerHelper;
        this._sessionStore = sessionStore;
        this._principalStore = principalStore;

        this.sections = getSections(auth, routerHelper);
        this.workspace = this._principalStore.getPrincipal();

        this._principalStore.addPrincipalChangeListener(onChange);
        this._selectState();

        watches.concat([
            $rootScope.$on('$stateChangeSuccess', () => this._selectState())
        ]);

        $scope.$on('$destroy', () => {
            this._principalStore.removePrincipalChangeListener(onChange);
            watches.forEach((x) => x());
        });
    }

    _selectState() {
        const currentState = this._$state.current;

        if (currentState.data && currentState.data.header) {
            this.selectedState = _.find(this.sections, (x) => x.data.header.name === currentState.data.header.name);
        }
    }

    goToSection(section) {
        return section.data.header.click(this._$injector);
    }

    isLoggedIn() {
        return this._auth.isLoggedIn();
    }

    logout() {
        this._auth.logout();
    }
}

function getSections(auth, routerHelper) {
    return _.chain(routerHelper.getStates())
        .filter(x => x.data && x.data.header && x.data.header.position && auth.authorize(x.data.access))
        .sort((x, y) => x.data.header.position - y.data.header.position)
        .value();
}

export default HeaderController;

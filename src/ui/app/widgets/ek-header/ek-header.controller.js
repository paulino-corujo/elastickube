import constants from 'constants';
import mockWorkspaces from 'mocks/workspaces';

class HeaderController {
    constructor($rootScope, $scope, auth, routerHelper, sessionStore) {
        'ngInject';
        const watches = [];

        this._$rootScope = $rootScope;
        this._auth = auth;
        this._sessionStoreService = sessionStore;

        this.sections = getSections(auth, routerHelper);
        this.workspace = _.find(mockWorkspaces, { id: 'alberto' });

        watches.concat([
            $rootScope.$on('$stateChangeSuccess', (event, toState) => this.selectedState = toState.name)
        ]);

        $scope.$on('$destroy', () => watches.forEach((x) => x()));
    }

    goToSection(section) {
        this._$rootScope.$emit(constants.NAVIGATE_TO, section);
    }

    isLoggedIn() {
        return this._auth.isLoggedIn();
    }

    logout() {
        return this._auth.logout();
    }
}

function getSections(auth, routerHelper) {
    return _.chain(routerHelper.getStates())
        .filter(x => x.data && x.data.header && auth.authorize(x.data.access))
        .sort((x, y) => x.data.header.position - y.data.header.position)
        .value();
}

export default HeaderController;

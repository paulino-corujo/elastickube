import RouterHelper from './router-helper';

class RouterHelperProvider {
    constructor($stateProvider, $urlRouterProvider) {
        this._hasOtherwise = false;
        this._$stateProvider = $stateProvider;
        this._$urlRouterProvider = $urlRouterProvider;

        this.$get = ($state) => {
            'ngInject';

            return new RouterHelper($state);
        };
    }

    configureStates(states, otherwisePath) {
        states.forEach((x) => this._$stateProvider.state(x.state, x.config));

        if (otherwisePath && !this._hasOtherwise) {
            this._hasOtherwise = true;
            this._$urlRouterProvider.otherwise(otherwisePath);
        }
    }
}

function routerHelperProvider($stateProvider, $urlRouterProvider) {
    'ngInject';

    return new RouterHelperProvider($stateProvider, $urlRouterProvider);
}

export default routerHelperProvider;

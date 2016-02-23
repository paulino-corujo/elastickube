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

    configureOtherwise(otherwise) {
        if (this._hasOtherwise) {
            throw new Error('Otherwise already configured');
        } else if (otherwise) {
            this._hasOtherwise = true;
            this._$urlRouterProvider.otherwise(otherwise);
        }
    }

    configureStates(states) {
        states.forEach((x) => this._$stateProvider.state(x.state, x.config));
    }
}

function routerHelperProvider($stateProvider, $urlRouterProvider) {
    'ngInject';

    return new RouterHelperProvider($stateProvider, $urlRouterProvider);
}

export default routerHelperProvider;

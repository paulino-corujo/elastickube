class RouterHelper {
    constructor($state) {
        'ngInject';

        this._$state = $state;
    }

    changeToState(state, stateParams, options) {
        return this._$state.go(state, stateParams, options);
    }

    getStates() {
        return this._$state.get();
    }
}

export default RouterHelper;

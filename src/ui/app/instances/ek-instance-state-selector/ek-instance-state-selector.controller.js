class InstanceStateSelectorController {
    constructor($scope) {
        'ngInject';

        this.states = ['all', 'online', 'unavailable', 'processing', 'terminated'];
        this.selectedState = _.first(this.states);

        $scope.$watchCollection('ctrl.instances', (x) => this.stateValues = countStates(x));
    }

    selectState(state) {
        this.selectedState = state;
    }
}

function countStates(instances) {
    return _.chain(instances)
        .groupBy('state')
        .mapValues((x) => x.length)
        .value();
}

export default InstanceStateSelectorController;

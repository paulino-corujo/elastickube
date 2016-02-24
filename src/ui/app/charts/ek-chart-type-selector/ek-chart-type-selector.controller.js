const types = [
    'all'
];

class ChartTypeSelectorController {
    constructor($scope) {
        'ngInject';

        this.types = types;
        this.selectedType = _.first(this.types);

        $scope.$watchCollection('ctrl.charts', (x) => this.typeValues = countTypes(x));
    }

    selectType(state) {
        this.selectedType = state;
    }
}

function countTypes(charts) {
    return _.chain(charts)
        .groupBy('type')
        .mapValues((x) => x.length)
        .value();
}

export default ChartTypeSelectorController;

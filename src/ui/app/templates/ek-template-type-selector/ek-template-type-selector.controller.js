const types = [
    'all',
    'resource list',
    'replication controller',
    'services',
    'volumes',
    'persistent volumes',
    'secrets',
    'ingress',
    'job',
    'pod autoscaling'
];

class TemplateTypeSelectorController {
    constructor($scope) {
        'ngInject';

        this.types = types;
        this.selectedType = _.first(this.types);

        $scope.$watchCollection('ctrl.templates', (x) => this.typeValues = countTypes(x));
    }

    selectType(state) {
        this.selectedType = state;
    }
}

function countTypes(templates) {
    return _.chain(templates)
        .groupBy('type')
        .mapValues((x) => x.length)
        .value();
}

export default TemplateTypeSelectorController;

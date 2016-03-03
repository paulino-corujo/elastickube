class InstanceOverviewLabelsController {
    constructor($scope, instanceStore) {
        'ngInject';

        const onChange = () => this.instance = instanceStore.getInstance();

        this.instance = instanceStore.getInstance();

        instanceStore.addChangeListener(onChange);

        $scope.$on('$destroy', () => instanceStore.removeChangeListener(onChange));
    }
}

export default InstanceOverviewLabelsController;

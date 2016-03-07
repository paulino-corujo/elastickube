class InstanceOverviewController {
    constructor($scope, instanceStore) {
        'ngInject';

        const onChange = () => {
            this.instance = instanceStore.getInstance();
            this.events = instanceStore.getEvents();
            this.endpoints = instanceStore.getEndpoints();
        };

        this.instance = instanceStore.getInstance();
        this.events = instanceStore.getEvents();
        this.endpoints = instanceStore.getEndpoints();

        instanceStore.addChangeListener(onChange);

        $scope.$on('$destroy', () => instanceStore.removeChangeListener(onChange));
    }
}

export default InstanceOverviewController;

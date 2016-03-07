class InstanceController {
    constructor($scope, instancesNavigationActionCreator, instanceStore) {
        'ngInject';

        const onChange = () => this._updateInstance();

        this._instancesNavigationActionCreator = instancesNavigationActionCreator;
        this._instanceStore = instanceStore;

        this._updateInstance();

        instanceStore.addChangeListener(onChange);

        $scope.$on('$destroy', () => instanceStore.removeChangeListener(onChange));
    }

    _updateInstance() {
        this.instance = this._instanceStore.getInstance();

        if (_.isUndefined(this.instance)) {
            return this._instancesNavigationActionCreator.instances();
        }
    }
}

export default InstanceController;

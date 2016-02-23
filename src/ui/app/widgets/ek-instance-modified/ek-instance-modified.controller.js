class InstanceModifiedController {
    constructor($scope, usersStore) {
        'ngInject';

        const onChange = () => this._userStoreService.get(this.instance.owner);

        this._$scope = $scope;
        this._userStoreService = usersStore;

        this.owner = this._userStoreService.get(this.instance.owner);

        this._userStoreService.addChangeListener(onChange);

        this._$scope.$on('$destroy', () => {
            this._userStoreService.removeChangeListener(onChange);
        });
    }

    getModifiedTimestamp() {
        return this.instance.status.startTime ? this.instance.status.startTime : this.instance.metadata.creationTimestamp;
    }
}

export default InstanceModifiedController;

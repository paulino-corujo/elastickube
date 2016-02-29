class InstanceModifiedController {
    constructor($scope, usersStore) {
        'ngInject';

        const onChange = () => this._userStore.get(this.instance.owner);

        this._$scope = $scope;
        this._userStore = usersStore;

        this.owner = this._userStore.get(this.instance.owner);

        this._userStore.addChangeListener(onChange);

        this._$scope.$on('$destroy', () => {
            this._userStore.removeChangeListener(onChange);
        });
    }

    getModifiedTimestamp() {
        return this.instance.status.startTime ? this.instance.status.startTime : this.instance.metadata.creationTimestamp;
    }
}

export default InstanceModifiedController;

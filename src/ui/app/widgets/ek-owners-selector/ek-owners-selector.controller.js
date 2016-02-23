class OwnersSelectorController {
    constructor($scope, usersStore) {
        'ngInject';

        this._userStoreService = usersStore;

        this.selectedOwners = this.selectedOwners || [];
        this.open = true;

        $scope.$watchCollection('ctrl.shareables', (x) => {
            this.owners = getOwners(x);
            this.selectedOwners = _.filter(this.selectedOwners, (y) => !!_.find(this.owners, { id: y }));
        });
    }

    toggleOpen() {
        this.open = !this.open;
    }

    isOwnerSelected(owner) {
        return _.includes(this.selectedOwners, owner.id);
    }

    toggleSelectedOwner(owner) {
        if (this.isOwnerSelected(owner)) {
            this.selectedOwners = _.without(this.selectedOwners, owner.id);
        } else {
            this.selectedOwners = this.selectedOwners.concat(owner.id);
        }
    }
}

function getOwners(shareables) {
    return _.chain(shareables)
        .map((x) => _.find(this._userStoreService.getAll(), { id: x.owner }))
        .uniq()
        .sortBy('id')
        .value();
}

export default OwnersSelectorController;

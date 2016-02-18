import mockWorkspaces from 'mocks/workspaces';

class OwnerInfoController {
    constructor() {
        this.owner = _.find(mockWorkspaces, { id: this.shareable.owner });
    }
}

export default OwnerInfoController;

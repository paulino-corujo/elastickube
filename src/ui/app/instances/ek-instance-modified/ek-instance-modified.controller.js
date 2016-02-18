import mockWorkspaces from 'mocks/workspaces';

class InstanceModifiedController {
    constructor() {
        this.owner = _.find(mockWorkspaces, { id: this.instance.owner });
    }
}

export default InstanceModifiedController;

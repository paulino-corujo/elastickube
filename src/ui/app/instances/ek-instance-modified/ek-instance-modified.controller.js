import mockUsers from 'mocks/users';

class InstanceModifiedController {
    constructor() {
        this.owner = _.find(mockUsers, { id: this.instance.owner });
    }
}

export default InstanceModifiedController;

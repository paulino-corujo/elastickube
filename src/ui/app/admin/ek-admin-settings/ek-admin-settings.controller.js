class AdminSettingsController {
    constructor() {
        this.admins = [];
    }

    removeAdmin(admin) {
        this.admins = _.without(this.admins, admin);
    }
}

export default AdminSettingsController;

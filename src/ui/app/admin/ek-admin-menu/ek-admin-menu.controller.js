import icons from '../icons';

class AdminMenuController {
    constructor($rootScope, $state, routerHelper) {
        'ngInject';

        this._$state = $state;
        this._routerHelper = routerHelper;

        this.items = [
            { icon: icons.IC_SETTINGS_48PX, name: 'settings', state: 'admin.settings' },
            { icon: icons.IC_USERS_48PX, name: 'users', state: 'admin.users' },
            { icon: icons.IC_NAMESPACES_48PX, name: 'namespaces', state: 'admin.namespaces' },
            { icon: icons.IC_SETTINGS_48PX, name: 'templates', state: 'admin.templates' },
            { icon: icons.IC_SETTINGS_48PX, name: 'instances', state: 'admin.instances' }
        ];

        this.selectedItem = this._getSelectedItem();

        $rootScope.$on('$stateChangeSuccess', () => {
            this.selectedItem = this._getSelectedItem();
        });
    }

    _getSelectedItem() {
        return _.find(this.items, (x) => this._$state.current.name === x.state);
    }

    selectItem(item) {
        this._routerHelper.changeToState(item.state);
    }
}

export default AdminMenuController;

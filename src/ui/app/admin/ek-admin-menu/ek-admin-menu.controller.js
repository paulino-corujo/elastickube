import icons from '../icons';

class AdminMenuController {
    constructor($rootScope, $state, adminNavigationActionCreator) {
        'ngInject';

        this._$state = $state;
        this._adminNavigationActionCreator = adminNavigationActionCreator;

        this.items = [
            { icon: icons.IC_SETTINGS_48PX, name: 'settings', state: 'settings' },
            { icon: icons.IC_USERS_48PX, name: 'users', state: 'users' },
            { icon: icons.IC_NAMESPACES_48PX, name: 'namespaces', state: 'namespaces' },
            { icon: icons.IC_SETTINGS_48PX, name: 'templates', state: 'templates' },
            { icon: icons.IC_SETTINGS_48PX, name: 'instances', state: 'instances' }
        ];

        this.selectedItem = this._getSelectedItem();

        $rootScope.$on('$stateChangeSuccess', () => {
            this.selectedItem = this._getSelectedItem();
        });
    }

    _getSelectedItem() {
        return _.find(this.items, (x) => this._$state.current.name.split('.')[1] === x.state);
    }

    selectItem(item) {
        return this._adminNavigationActionCreator[item.state]();
    }
}

export default AdminMenuController;

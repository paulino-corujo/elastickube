import icons from '../icons';

class AdminMenuController {
    constructor($rootScope, $state, adminNavigationActionCreator) {
        'ngInject';

        this._$state = $state;
        this._adminNavigationActionCreator = adminNavigationActionCreator;

        this.items = [
            { icon: icons.SETTINGS, name: 'settings', state: 'settings' },
            { icon: icons.USERS, name: 'users', state: 'users' },
            { icon: icons.NAMESPACES, name: 'namespaces', state: 'namespaces' },
            { icon: icons.CHARTS, name: 'charts', state: 'charts' },
            { icon: icons.INSTANCES, name: 'instances', state: 'instances' }
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

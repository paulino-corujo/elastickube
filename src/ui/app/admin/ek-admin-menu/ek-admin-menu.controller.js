/*
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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

    goDiagnostics() {
        window.location.assign('/diagnostics');
    }

    selectItem(item) {
        return this._adminNavigationActionCreator[item.state]();
    }
}

export default AdminMenuController;

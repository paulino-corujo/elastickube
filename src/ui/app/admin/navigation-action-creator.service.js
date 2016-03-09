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

class NavigationActionCreatorService {
    constructor($mdDialog, confirmDialog, routerHelper, sessionStore) {
        'ngInject';

        this._$mdDialog = $mdDialog;
        this._confirmDialog = confirmDialog;
        this._routerHelper = routerHelper;
        this._sessionStore = sessionStore;
    }

    settings(stateOptions) {
        return this._routerHelper.changeToState('admin.settings', stateOptions);
    }

    users() {
        return this._routerHelper.changeToState('admin.users');
    }

    namespaces() {
        return this._routerHelper.changeToState('admin.namespaces');
    }

    charts() {
        return this._routerHelper.changeToState('admin.charts');
    }

    instances() {
        return this._routerHelper.changeToState('admin.instances');
    }

    warnOutboundEmailDisabled() {
        return this._confirmDialog.confirm({
            title: 'Outbound email is turned off',
            content: 'An outbound email server and no reply address must be specified in order to send invites.',
            ok: 'TURN ON',
            cancel: 'NOT NOW'
        }).then(() => {
            return this.settings({ focusSection: 'email' });
        });
    }

    inviteUsers() {
        return this._$mdDialog.show({
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            openFrom: 'left',
            closeTo: 'right',
            disableParentScroll: true,
            template: '<ek-invite-users></ek-invite-users>'
        });
    }
}

export default NavigationActionCreatorService;

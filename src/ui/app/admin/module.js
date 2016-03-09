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

import coreModule from 'core/module';
import layoutModule from 'layout/module';
import widgetsModule from 'widgets/module';

import adminRoutes from './admin-routes';

import NavigationActionCreator from './navigation-action-creator.service';

import AdminChartsDirective from './ek-admin-charts/ek-admin-charts.directive';
import AdminDirective from './ek-admin/ek-admin.directive';
import AdminInstancesDirective from './ek-admin-instances/ek-admin-instances.directive';
import AdminMenuDirective from './ek-admin-menu/ek-admin-menu.directive';
import AdminNewNamespaceDirective from './ek-admin-new-namespace/ek-admin-new-namespace.directive';
import AdminNamespacesDirective from './ek-admin-namespaces/ek-admin-namespaces.directive';
import AdminSettingsDirective from './ek-admin-settings/ek-admin-settings.directive';
import AdminUsersDirective from './ek-admin-users/ek-admin-users.directive';
import InviteUsersDirective from './ek-invite-users/ek-invite-users.directive';

const moduleName = 'app.admin';

angular
    .module(moduleName, [
        coreModule,
        layoutModule,
        widgetsModule
    ])
    .config(adminRoutes)

    .service('adminNavigationActionCreator', NavigationActionCreator)

    .directive('ekAdminTemplates', () => new AdminChartsDirective())
    .directive('ekAdmin', () => new AdminDirective())
    .directive('ekAdminInstances', () => new AdminInstancesDirective())
    .directive('ekAdminMenu', () => new AdminMenuDirective())
    .directive('ekAdminNamespaces', () => new AdminNamespacesDirective())
    .directive('ekAdminNewNamespace', () => new AdminNewNamespaceDirective())
    .directive('ekAdminSettings', () => new AdminSettingsDirective())
    .directive('ekAdminUsers', () => new AdminUsersDirective())
    .directive('ekInviteUsers', () => new InviteUsersDirective());

export default moduleName;

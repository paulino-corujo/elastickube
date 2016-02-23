import coreModule from 'core/module';
import layoutModule from 'layout/module';
import widgetsModule from 'widgets/module';

import adminRoutes from './admin-routes';

import NavigationActionCreator from './navigation-action-creator.service';

import AdminDirective from './ek-admin/ek-admin.directive';
import AdminMenuDirective from './ek-admin-menu/ek-admin-menu.directive';
import AdminSettingsDirective from './ek-admin-settings/ek-admin-settings.directive';
import AdminUsersDirective from './ek-admin-users/ek-admin-users.directive';
import AdminNamespacesDirective from './ek-admin-namespaces/ek-admin-namespaces.directive';
import AdminTemplatesDirective from './ek-admin-templates/ek-admin-templates.directive';
import AdminInstancesDirective from './ek-admin-instances/ek-admin-instances.directive';

const moduleName = 'app.admin';

angular
    .module(moduleName, [
        coreModule,
        layoutModule,
        widgetsModule
    ])
    .config(adminRoutes)

    .service('adminNavigationActionCreator', NavigationActionCreator)

    .directive('ekAdmin', () => new AdminDirective())
    .directive('ekAdminMenu', () => new AdminMenuDirective())
    .directive('ekAdminSettings', () => new AdminSettingsDirective())
    .directive('ekAdminUsers', () => new AdminUsersDirective())
    .directive('ekAdminNamespaces', () => new AdminNamespacesDirective())
    .directive('ekAdminTemplates', () => new AdminTemplatesDirective())
    .directive('ekAdminInstances', () => new AdminInstancesDirective());

export default moduleName;

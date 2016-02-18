import coreModule from 'core/module';
import layoutModule from 'layout/module';
import widgetsModule from 'widgets/module';

import adminRoutes from './admin-routes';
import AdminDirective from './ek-admin/ek-admin.directive';

const moduleName = 'app.admin';

angular
    .module(moduleName, [
        coreModule,
        layoutModule,
        widgetsModule
    ])
    .config(adminRoutes)
    .directive('ekAdmin', () => new AdminDirective());

export default moduleName;

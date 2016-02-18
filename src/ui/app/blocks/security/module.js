import 'angular-cookies';

import routerModule from 'blocks/router/module';
import sessionModule from 'blocks/session/module';

import authService from './auth.service';
import authRoutes from './auth-routes';
import checkRouteAccess from './check-route-access';

const moduleName = 'blocks.security';

angular
    .module(moduleName, [
        'ngCookies',
        routerModule,
        sessionModule
    ])
    .config(authRoutes)
    .service('auth', authService)
    .run(checkRouteAccess);

export default moduleName;

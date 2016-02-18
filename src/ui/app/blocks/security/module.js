import 'angular-cookies';

import routerModule from 'blocks/router/module';
import sessionModule from 'blocks/session/module';

import authProvider from './auth.provider';
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
    .provider('auth', authProvider)
    .run(checkRouteAccess);

export default moduleName;

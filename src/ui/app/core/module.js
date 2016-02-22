import './core.less';

import 'angular-aria';
import 'angular-animate';
import 'angular-cookies';
import 'angular-messages';
import 'angular-ui-grid/ui-grid';
import 'angular-material/angular-material';

import apiModule from 'blocks/api/module';
import routerModule from 'blocks/router/module';

import actions from './dataflow/actions';
import DispatcherService from './dataflow/dispatcher.service.js';
import InstancesActionCreatorService from './dataflow/instances-action-creator.service.js';
import InstancesStoreService from './dataflow/instances-store.service.js';
import NamespacesActionCreatorService from './dataflow/namespaces-action-creator.service.js';
import NamespacesStoreService from './dataflow/namespaces-store.service.js';
import SessionActionCreatorService from './dataflow/session-action-creator.service';
import SessionStoreService from './dataflow/session-store.service.js';
import PrincipalActionCreatorService from './dataflow/principal-action-creator.service';
import PrincipalStoreService from './dataflow/principal-store.service.js';
import UsersActionCreatorService from './dataflow/users-action-creator.service';
import UsersStoreService from './dataflow/users-store.service.js';
import WebsocketActionCreatorService from './dataflow/websocket-action-creator.service';

import humanizeDateFilter from './filters/humanize-date.filter';
import InitializationService from './services/initialization.service';
import LoginService from './services/login.service';
import MultiTranscludeService from './services/multi-transclude.service';
import AuthService from './security/auth.service';
import SessionService from './services/session.service';

const moduleName = 'app.core';

angular
    .module(moduleName, [
        'ngMaterial',
        'ngAnimate',
        'ngCookies',
        'ngMessages',
        'ui.grid',
        'ui.grid.selection',
        apiModule,
        routerModule
    ])

    .constant('storage', localStorage)
    .constant('actions', actions)

    .filter('ekHumanizeDate', () => humanizeDateFilter)

    .service('session', SessionService)
    .service('auth', AuthService)
    .service('dispatcher', DispatcherService)
    .service('initialization', InitializationService)
    .service('login', LoginService)
    .service('multiTransclude', MultiTranscludeService)

    .service('instancesActionCreator', InstancesActionCreatorService)
    .service('instancesStore', InstancesStoreService)

    .service('namespacesActionCreator', NamespacesActionCreatorService)
    .service('namespacesStore', NamespacesStoreService)

    .service('sessionActionCreator', SessionActionCreatorService)
    .service('sessionStore', SessionStoreService)

    .service('principalActionCreator', PrincipalActionCreatorService)
    .service('principalStore', PrincipalStoreService)

    .service('usersActionCreator', UsersActionCreatorService)
    .service('usersStore', UsersStoreService)

    .service('websocketActionCreator', WebsocketActionCreatorService);

export default moduleName;

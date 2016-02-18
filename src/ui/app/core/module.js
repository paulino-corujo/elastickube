import './core.less';

import 'angular-aria';
import 'angular-animate';
import 'angular-messages';
import 'angular-material/angular-material';

import apiModule from 'blocks/api/module';
import routerModule from 'blocks/router/module';
import securityModule from 'blocks/security/module';
import sessionModule from 'blocks/session/module';

import actions from './dataflow/actions';
import DispatcherService from './dataflow/dispatcher.service.js';
import InstancesActionCreatorService from './dataflow/instances-action-creator.service.js';
import InstancesStoreService from './dataflow/instances-store.service.js';
import NamespacesActionCreatorService from './dataflow/namespaces-action-creator.service.js';
import NamespacesStoreService from './dataflow/namespaces-store.service.js';
import SessionActionCreatorService from './dataflow/session-action-creator.service';
import SessionStoreService from './dataflow/session-store.service.js';

import humanizeDateFilter from './filters/humanize-date.filter';
import MultiTranscludeService from './services/multi-transclude.service';

const moduleName = 'app.core';

angular
    .module(moduleName, [
        'ngMaterial',
        'ngAnimate',
        'ngMessages',
        apiModule,
        routerModule,
        securityModule,
        sessionModule
    ])
    .constant('actions', actions)
    .filter('ekHumanizeDate', () => humanizeDateFilter)

    .service('dispatcher', DispatcherService)
    .service('multiTransclude', MultiTranscludeService)

    .service('instancesActionCreator', InstancesActionCreatorService)
    .service('instancesStore', InstancesStoreService)

    .service('namespacesActionCreator', NamespacesActionCreatorService)
    .service('namespacesStore', NamespacesStoreService)

    .service('sessionActionCreator', SessionActionCreatorService)
    .service('sessionStore', SessionStoreService);

export default moduleName;

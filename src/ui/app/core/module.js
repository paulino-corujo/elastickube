import './core.less';

import 'angular-aria';
import 'angular-animate';
import 'angular-messages';
import 'angular-material/angular-material';

import apiModule from 'blocks/api/module';
import routerModule from 'blocks/router/module';
import securityModule from 'blocks/security/module';
import sessionModule from 'blocks/session/module';

import actions from 'core/dataflow/actions';
import DispatcherService from 'core/dataflow/dispatcher.service.js';
import InstancesActionCreatorService from 'core/dataflow/instances-action-creator.service.js';
import InstancesStoreService from 'core/dataflow/instances-store.service.js';
import NamespacesActionCreatorService from 'core/dataflow/namespaces-action-creator.service.js';
import NamespacesStoreService from 'core/dataflow/namespaces-store.service.js';
import SessionStoreService from 'core/dataflow/session-store.service.js';
import UIActionCreatorService from 'core/dataflow/ui-action-creator';

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
    .filter('ekHumanizeDate', () => humanizeDateFilter)
    .constant('actions', actions)
    .service('dispatcher', DispatcherService)
    .service('instancesActionCreator', InstancesActionCreatorService)
    .service('instancesStore', InstancesStoreService)
    .service('multiTransclude', MultiTranscludeService)
    .service('namespacesActionCreator', NamespacesActionCreatorService)
    .service('namespacesStore', NamespacesStoreService)
    .service('sessionStore', SessionStoreService)
    .service('uiActionCreator', UIActionCreatorService);

export default moduleName;

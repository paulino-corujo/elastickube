import actions from './actions';
import DispatcherService from './dispatcher.service.js';
import InstancesActionCreatorService from './instances-action-creator.service.js';
import InstancesStoreService from './instances-store.service.js';
import NamespacesActionCreatorService from './namespaces-action-creator.service.js';
import NamespacesStoreService from './namespaces-store.service.js';
import SessionStoreService from './session-store.service.js';
import UIActionCreatorService from './ui-action-creator';

const moduleName = 'blocks.dataflow';

angular
    .module(moduleName, [])
    .constant('actions', actions)
    .service('dispatcher', DispatcherService)
    .service('instancesActionCreator', InstancesActionCreatorService)
    .service('instancesStore', InstancesStoreService)
    .service('namespacesActionCreator', NamespacesActionCreatorService)
    .service('namespacesStore', NamespacesStoreService)
    .service('sessionStore', SessionStoreService)
    .service('uiActionCreator', UIActionCreatorService);

export default moduleName;

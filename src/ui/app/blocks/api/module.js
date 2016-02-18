import InstancesAPIService from './instances-api.service';
import NamespacesAPIService from './namespaces-api.service';
import WebsocketClientService from './websocket-client.service';

const moduleName = 'blocks.api';

angular
    .module(moduleName, [])
    .run(($injector, instancesActionCreator, namespacesActionCreator)=> {
        'ngInject';

        $injector.get('instancesAPI');
        $injector.get('namespacesAPI');

        // FIXME To be removed when the change namespace feature is developed
        instancesActionCreator.preload();
        namespacesActionCreator.preload();
    })
    .service('instancesAPI', InstancesAPIService)
    .service('namespacesAPI', NamespacesAPIService)
    .service('websocketClient', WebsocketClientService);

export default moduleName;

import InstancesAPIService from './instances-api.service';
import NamespacesAPIService from './namespaces-api.service';
import WebsocketClientService from './websocket-client.service';

const moduleName = 'blocks.api';

angular
    .module(moduleName, [])
    .service('instancesAPI', InstancesAPIService)
    .service('namespacesAPI', NamespacesAPIService)
    .service('websocketClient', WebsocketClientService);

export default moduleName;

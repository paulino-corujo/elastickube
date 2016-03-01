import ChartsAPIService from './charts-api.service';
import InstanceAPIService from './instance-api.service';
import InstancesAPIService from './instances-api.service';
import NamespacesAPIService from './namespaces-api.service';
import PrincipalAPIService from './principal-api.service';
import SettingsAPIService from './settings-api.service';
import UsersAPIService from './users-api.service';
import WebsocketClientService from './websocket-client.service';

const moduleName = 'blocks.api';

angular
    .module(moduleName, [])

    .service('chartsAPI', ChartsAPIService)
    .service('instanceAPI', InstanceAPIService)
    .service('instancesAPI', InstancesAPIService)
    .service('namespacesAPI', NamespacesAPIService)
    .service('principalAPI', PrincipalAPIService)
    .service('settingsAPI', SettingsAPIService)
    .service('usersAPI', UsersAPIService)

    .service('websocketClient', WebsocketClientService);

export default moduleName;

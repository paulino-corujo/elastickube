import ChartsAPIService from './charts-api.service';
import InstancesAPIService from './instances-api.service';
import NamespacesAPIService from './namespaces-api.service';
import PrincipalAPIService from './principal-api.service';
import SettingsAPIService from './settings-api.service';
import UsersAPIService from './users-api.service';
import InvitesAPIService from './invites-api.service';
import WebsocketClientService from './websocket-client.service';

const moduleName = 'blocks.api';

angular
    .module(moduleName, [])

    .service('chartsAPI', ChartsAPIService)
    .service('instancesAPI', InstancesAPIService)
    .service('namespacesAPI', NamespacesAPIService)
    .service('principalAPI', PrincipalAPIService)
    .service('settingsAPI', SettingsAPIService)
    .service('usersAPI', UsersAPIService)
    .service('invitesAPI', InvitesAPIService)

    .service('websocketClient', WebsocketClientService);

export default moduleName;

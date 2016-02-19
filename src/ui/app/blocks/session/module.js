import 'angular-cookies';
import sessionService from './session.service';

const moduleName = 'blocks.session';

angular
    .module(moduleName, [
        'ngCookies'
    ])
    .constant('storage', localStorage)
    .service('session', sessionService);

export default moduleName;

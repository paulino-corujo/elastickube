import sessionProvider from './session.provider';

const moduleName = 'blocks.session';

angular
    .module(moduleName, [])
    .constant('storage', localStorage)
    .provider('session', sessionProvider);

export default moduleName;

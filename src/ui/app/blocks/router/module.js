import 'ui-router';

import routerHelperProvider from './router-helper.provider';

const moduleName = 'blocks.router';

angular
    .module(moduleName, [
        'ui.router'
    ])
    .provider('routerHelper', routerHelperProvider);

export default moduleName;

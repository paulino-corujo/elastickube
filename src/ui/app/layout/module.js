import coreModule from 'core/module';

import HeaderLayoutDirective from './ek-header-layout/ek-header-layout.directive';
import SideNavLayoutDirective from './ek-sidenav-layout/ek-sidenav-layout.directive';

const moduleName = 'app.layout';

angular
    .module(moduleName, [
        coreModule
    ])
    .directive('ekHeaderLayout', (multiTransclude) => {
        'ngInject';

        return new HeaderLayoutDirective(multiTransclude);
    })
    .directive('ekSidenavLayout', (multiTransclude) => {
        'ngInject';

        return new SideNavLayoutDirective(multiTransclude);
    });

export default moduleName;

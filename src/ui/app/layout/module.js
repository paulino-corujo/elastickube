/*
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import coreModule from 'core/module';

import ApplicationLayoutDirective from './ek-application-layout/ek-application-layout.directive';
import HeaderLayoutDirective from './ek-header-layout/ek-header-layout.directive';
import SideNavLayoutDirective from './ek-sidenav-layout/ek-sidenav-layout.directive';

const moduleName = 'app.layout';

angular
    .module(moduleName, [
        coreModule
    ])
    .directive('ekApplicationLayout', (multiTransclude) => {
        'ngInject';

        return new ApplicationLayoutDirective(multiTransclude);
    })
    .directive('ekHeaderLayout', (multiTransclude) => {
        'ngInject';

        return new HeaderLayoutDirective(multiTransclude);
    })
    .directive('ekSidenavLayout', (multiTransclude) => {
        'ngInject';

        return new SideNavLayoutDirective(multiTransclude);
    });

export default moduleName;

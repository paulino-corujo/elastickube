import coreModule from 'core/module';
import layoutModule from 'layout/module';
import widgetsModule from 'widgets/module';

import instancesRoutes from './instances-routes';
import InstanceFiltersDirective from './ek-instance-filters/ek-instance-filters.directive';
import InstanceListDirective from './ek-instance-list/ek-instance-list.directive';
import InstanceStateSelectorDirective from './ek-instance-state-selector/ek-instance-state-selector.directive';
import InstancesDirective from './ek-instances/ek-instances.directive';

const moduleName = 'app.instances';

angular
    .module(moduleName, [
        coreModule,
        layoutModule,
        widgetsModule
    ])
    .config(instancesRoutes)
    .directive('ekInstanceFilters', () => new InstanceFiltersDirective())
    .directive('ekInstanceList', () => new InstanceListDirective())
    .directive('ekInstanceStateSelector', () => new InstanceStateSelectorDirective())
    .directive('ekInstances', () => new InstancesDirective());

export default moduleName;

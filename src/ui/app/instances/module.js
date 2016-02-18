import coreModule from 'core/module';
import layoutModule from 'layout/module';
import widgetsModule from 'widgets/module';

import instancesRoutes from './instances-routes';
import InstanceFiltersDirective from './ek-instance-filters/ek-instance-filters.directive';
import InstanceLabelsDirective from './ek-instance-labels/ek-instance-labels.directive';
import InstanceListDirective from './ek-instance-list/ek-instance-list.directive';
import InstanceModifiedDirective from './ek-instance-modified/ek-instance-modified.directive';
import InstanceNameDirective from './ek-instance-name/ek-instance-name.directive';
import InstanceStateDirective from './ek-instance-state/ek-instance-state.directive';
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
    .directive('ekInstanceLabels', () => new InstanceLabelsDirective())
    .directive('ekInstanceList', () => new InstanceListDirective())
    .directive('ekInstanceModified', () => new InstanceModifiedDirective())
    .directive('ekInstanceName', () => new InstanceNameDirective())
    .directive('ekInstanceState', () => new InstanceStateDirective())
    .directive('ekInstanceStateSelector', () => new InstanceStateSelectorDirective())
    .directive('ekInstances', () => new InstancesDirective());

export default moduleName;

import coreModule from 'core/module';
import layoutModule from 'layout/module';
import widgetsModule from 'widgets/module';

import instancesRoutes from './instances-routes';

import NavigationActionCreator from './navigation-action-creator.service';

import InstanceDirective from './ek-instance/ek-instance.directive';
import InstanceContainerChartDirective from './ek-instance-container-chart/ek-instance-container-chart.directive';
import InstanceOverviewDirective from './ek-instance-overview/ek-instance-overview.directive';
import InstanceOverviewContainersDirective from './ek-instance-overview-containers/ek-instance-overview-containers.directive';
import InstanceOverviewDetailsDirective from './ek-instance-overview-details/ek-instance-overview-details.directive';
import InstanceOverviewLabelsDirective from './ek-instance-overview-labels/ek-instance-overview-labels.directive';
import InstanceOverviewEventsDirective from './ek-instance-overview-events/ek-instance-overview-events.directive';
import ChooseChartDirective from './ek-choose-chart/ek-choose-chart.directive';
import ChooseChartCardDirective from './ek-choose-chart-card/ek-choose-chart-card.directive';
import ChooseChartGridDirective from './ek-choose-chart-grid/ek-choose-chart-grid.directive';
import CustomizeDeploymentDirective from './ek-customize-deployment/ek-customize-deployment.directive';
import InstanceFiltersDirective from './ek-instance-filters/ek-instance-filters.directive';
import InstanceListDirective from './ek-instance-list/ek-instance-list.directive';
import InstanceStateSelectorDirective from './ek-instance-state-selector/ek-instance-state-selector.directive';
import InstancesDirective from './ek-instances/ek-instances.directive';
import NewInstanceDirective from './ek-new-instance/ek-new-instance.directive';

const moduleName = 'app.instances';

angular
    .module(moduleName, [
        coreModule,
        layoutModule,
        widgetsModule
    ])
    .config(instancesRoutes)

    .service('instancesNavigationActionCreator', NavigationActionCreator)

    .directive('ekInstance', () => new InstanceDirective())
    .directive('ekInstanceContainerChart', () => new InstanceContainerChartDirective())
    .directive('ekInstanceOverview', () => new InstanceOverviewDirective())
    .directive('ekInstanceOverviewContainers', () => new InstanceOverviewContainersDirective())
    .directive('ekInstanceOverviewDetails', () => new InstanceOverviewDetailsDirective())
    .directive('ekInstanceOverviewLabels', () => new InstanceOverviewLabelsDirective())
    .directive('ekInstanceOverviewEvents', () => new InstanceOverviewEventsDirective())
    .directive('ekChooseChart', () => new ChooseChartDirective())
    .directive('ekChooseChartCard', () => new ChooseChartCardDirective())
    .directive('ekChooseChartGrid', () => new ChooseChartGridDirective())
    .directive('ekCustomizeDeployment', () => new CustomizeDeploymentDirective())
    .directive('ekInstanceFilters', () => new InstanceFiltersDirective())
    .directive('ekInstanceList', () => new InstanceListDirective())
    .directive('ekInstanceStateSelector', () => new InstanceStateSelectorDirective())
    .directive('ekInstances', () => new InstancesDirective())
    .directive('ekNewInstance', () => new NewInstanceDirective());

export default moduleName;

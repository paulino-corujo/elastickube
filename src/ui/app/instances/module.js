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
import layoutModule from 'layout/module';
import widgetsModule from 'widgets/module';

import instancesRoutes from './instances-routes';

import NavigationActionCreator from './navigation-action-creator.service';

import ChooseChartDirective from './ek-choose-chart/ek-choose-chart.directive';
import ChooseChartCardDirective from './ek-choose-chart-card/ek-choose-chart-card.directive';
import ChooseChartGridDirective from './ek-choose-chart-grid/ek-choose-chart-grid.directive';
import CustomizeDeploymentDirective from './ek-customize-deployment/ek-customize-deployment.directive';
import InstanceDirective from './ek-instance/ek-instance.directive';
import InstanceContainersDirective from './ek-instance-containers/ek-instance-containers.directive';
import InstanceContainerBlockDirective from './ek-instance-container-block/ek-instance-container-block.directive';
import InstanceContainerChartDirective from './ek-instance-container-chart/ek-instance-container-chart.directive';
import InstanceActionsDirective from './ek-instance-actions/ek-instance-actions.directive';
import InstanceBulkActionsDirective from './ek-instance-bulk-actions/ek-instance-bulk-actions.directive';
import InstanceDetailsBlockDirective from './ek-instance-details-block/ek-instance-details-block.directive';
import InstanceEventsBlockDirective from './ek-instance-events-block/ek-instance-events-block.directive';
import InstanceLabelsBlockDirective from './ek-instance-labels-block/ek-instance-labels-block.directive';
import InstanceOverviewDirective from './ek-instance-overview/ek-instance-overview.directive';
import InstanceOverviewContainersDirective from './ek-instance-overview-containers/ek-instance-overview-containers.directive';
import InstanceOverviewSelectorsDirective from './ek-instance-overview-selectors/ek-instance-overview-selectors.directive';
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

    .directive('ekChooseChart', () => new ChooseChartDirective())
    .directive('ekChooseChartCard', () => new ChooseChartCardDirective())
    .directive('ekChooseChartGrid', () => new ChooseChartGridDirective())
    .directive('ekCustomizeDeployment', () => new CustomizeDeploymentDirective())
    .directive('ekInstance', () => new InstanceDirective())
    .directive('ekInstanceContainers', () => new InstanceContainersDirective())
    .directive('ekInstanceContainerBlock', () => new InstanceContainerBlockDirective())
    .directive('ekInstanceContainerChart', () => new InstanceContainerChartDirective())
    .directive('ekInstanceActions', () => new InstanceActionsDirective())
    .directive('ekInstanceBulkActions', () => new InstanceBulkActionsDirective())
    .directive('ekInstanceDetailsBlock', () => new InstanceDetailsBlockDirective())
    .directive('ekInstanceEventsBlock', () => new InstanceEventsBlockDirective())
    .directive('ekInstanceLabelsBlock', () => new InstanceLabelsBlockDirective())
    .directive('ekInstanceOverview', () => new InstanceOverviewDirective())
    .directive('ekInstanceOverviewContainers', () => new InstanceOverviewContainersDirective())
    .directive('ekInstanceOverviewSelectors', () => new InstanceOverviewSelectorsDirective())
    .directive('ekInstanceFilters', () => new InstanceFiltersDirective())
    .directive('ekInstanceList', () => new InstanceListDirective())
    .directive('ekInstanceStateSelector', () => new InstanceStateSelectorDirective())
    .directive('ekInstances', () => new InstancesDirective())
    .directive('ekNewInstance', () => new NewInstanceDirective());

export default moduleName;

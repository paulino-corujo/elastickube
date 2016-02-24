import coreModule from 'core/module';
import layoutModule from 'layout/module';
import widgetsModule from 'widgets/module';

import chartsRoutes from './charts-routes';

import NavigationActionCreator from './navigation-action-creator.service';

import ChartsCardDirective from './ek-chart-card/ek-chart-card.directive';
import ChartsFiltersDirective from './ek-chart-filters/ek-chart-filters.directive';
import ChartGridDirective from './ek-chart-grid/ek-chart-grid.directive';
import ChartListDirective from './ek-chart-list/ek-chart-list.directive';
import ChartNameDirective from './ek-chart-name/ek-chart-name.directive';
import ChartTypeSelectorDirective from './ek-chart-type-selector/ek-chart-type-selector.directive';
import ChartsDirective from './ek-charts/ek-charts.directive';
import ChartSorterDirective from './ek-chart-sorter/ek-chart-sorter.directive';

const moduleName = 'app.charts';

angular
    .module(moduleName, [
        coreModule,
        layoutModule,
        widgetsModule
    ])
    .config(chartsRoutes)

    .service('chartsNavigationActionCreator', NavigationActionCreator)

    .directive('ekChartCard', () => new ChartsCardDirective())
    .directive('ekChartFilters', () => new ChartsFiltersDirective())
    .directive('ekChartGrid', () => new ChartGridDirective())
    .directive('ekChartList', () => new ChartListDirective())
    .directive('ekChartName', () => new ChartNameDirective())
    .directive('ekChartTypeSelector', () => new ChartTypeSelectorDirective())
    .directive('ekCharts', () => new ChartsDirective())
    .directive('ekChartSorter', () => new ChartSorterDirective());

export default moduleName;

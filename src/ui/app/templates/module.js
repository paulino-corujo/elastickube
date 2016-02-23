import coreModule from 'core/module';
import layoutModule from 'layout/module';
import widgetsModule from 'widgets/module';

import templatesRoutes from './templates-routes';

import NavigationActionCreator from './navigation-action-creator.service';

import TemplateCardDirective from './ek-template-card/ek-template-card.directive';
import TemplateFiltersDirective from './ek-template-filters/ek-template-filters.directive';
import TemplateGridDirective from './ek-template-grid/ek-template-grid.directive';
import TemplateListDirective from './ek-template-list/ek-template-list.directive';
import TemplateNameDirective from './ek-template-name/ek-template-name.directive';
import TemplateTypeSelectorDirective from './ek-template-type-selector/ek-template-type-selector.directive';
import TemplatesDirective from './ek-templates/ek-templates.directive';
import TemplatesSorterDirective from './ek-templates-sorter/ek-templates-sorter.directive';

const moduleName = 'app.templates';

angular
    .module(moduleName, [
        coreModule,
        layoutModule,
        widgetsModule
    ])
    .config(templatesRoutes)

    .service('templatesNavigationActionCreator', NavigationActionCreator)

    .directive('ekTemplateCard', () => new TemplateCardDirective())
    .directive('ekTemplateFilters', () => new TemplateFiltersDirective())
    .directive('ekTemplateGrid', () => new TemplateGridDirective())
    .directive('ekTemplateList', () => new TemplateListDirective())
    .directive('ekTemplateName', () => new TemplateNameDirective())
    .directive('ekTemplateTypeSelector', () => new TemplateTypeSelectorDirective())
    .directive('ekTemplates', () => new TemplatesDirective())
    .directive('ekTemplatesSorter', () => new TemplatesSorterDirective());

export default moduleName;

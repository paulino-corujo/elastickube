import 'angular-material/angular-material';

import coreModule from 'core/module';

import AvatarDirective from './ek-avatar/ek-avatar.directive';
import ButtonGroupDirective from './ek-button-group/ek-button-group.directive';
import HeaderDirective from './ek-header/ek-header.directive';
import NamespaceSelectorDirective from './ek-namespaces-selector/ek-namespace-selector.directive';
import OwnerInfoDirective from './ek-owner-info/ek-owner-info.directive';
import OwnersSelectorDirective from './ek-owners-selector/ek-owners-selector.directive';
import SearchFilterDirective from './ek-search-filter/ek-search-filter.directive';
import TableDirective from './ek-table/ek-table.directive';

const moduleName = 'app.widgets';

angular
    .module(moduleName, [
        coreModule,
        'ngMaterial'
    ])
    .directive('ekAvatar', () => new AvatarDirective())
    .directive('ekButtonGroup', () => new ButtonGroupDirective())
    .directive('ekHeader', () => new HeaderDirective())
    .directive('ekNamespaceSelector', () => new NamespaceSelectorDirective())
    .directive('ekOwnerInfo', () => new OwnerInfoDirective())
    .directive('ekOwnersSelector', () => new OwnersSelectorDirective())
    .directive('ekSearchFilter', () => new SearchFilterDirective())
    .directive('ekTable', () => new TableDirective());

export default moduleName;

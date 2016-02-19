import 'angular-material/angular-material';

import coreModule from 'core/module';

import AvatarDirective from './ek-avatar/ek-avatar.directive';
import ButtonGroupDirective from './ek-button-group/ek-button-group.directive';
import HeaderDirective from './ek-header/ek-header.directive';
import NamespaceSelectorDirective from './ek-namespaces-selector/ek-namespace-selector.directive';
import OwnersSelectorDirective from './ek-owners-selector/ek-owners-selector.directive';
import SearchFilterDirective from './ek-search-filter/ek-search-filter.directive';
import SelectUsersDirective from './ek-select-users/ek-select-users.directive';
import TableDirective from './ek-table/ek-table.directive';
import UserInfoDirective from './ek-user-info/ek-user-info.directive';

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
    .directive('ekOwnersSelector', () => new OwnersSelectorDirective())
    .directive('ekSearchFilter', () => new SearchFilterDirective())
    .directive('ekSelectUsers', () => new SelectUsersDirective())
    .directive('ekTable', () => new TableDirective())
    .directive('ekUserInfo', () => new UserInfoDirective());

export default moduleName;

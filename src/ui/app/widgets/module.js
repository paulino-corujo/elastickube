import 'angular-material/angular-material';

import coreModule from 'core/module';

import AvatarDirective from './ek-avatar/ek-avatar.directive';
import ButtonGroupDirective from './ek-button-group/ek-button-group.directive';
import HeaderDirective from './ek-header/ek-header.directive';
import IkonDirective from './ek-ikon/ek-ikon.directive';
import InsertEmailsDirective from './ek-insert-emails/ek-insert-emails.directive';
import InsertLabelsDirective from './ek-insert-labels/ek-insert-labels.directive';
import InstanceLabelsDirective from './ek-instance-labels/ek-instance-labels.directive';
import InstanceModifiedDirective from './ek-instance-modified/ek-instance-modified.directive';
import InstanceNameDirective from './ek-instance-name/ek-instance-name.directive';
import InstanceStateDirective from './ek-instance-state/ek-instance-state.directive';
import NamespaceSelectorDirective from './ek-namespaces-selector/ek-namespace-selector.directive';
import OwnersSelectorDirective from './ek-owners-selector/ek-owners-selector.directive';
import SearchFilterDirective from './ek-search-filter/ek-search-filter.directive';
import SelectUsersDirective from './ek-select-users/ek-select-users.directive';
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
    .directive('ekIkon', () => new IkonDirective())
    .directive('ekInsertEmails', () => new InsertEmailsDirective())
    .directive('ekInsertLabels', () => new InsertLabelsDirective())
    .directive('ekInstanceLabels', () => new InstanceLabelsDirective())
    .directive('ekInstanceModified', () => new InstanceModifiedDirective())
    .directive('ekInstanceName', () => new InstanceNameDirective())
    .directive('ekInstanceState', () => new InstanceStateDirective())
    .directive('ekNamespaceSelector', () => new NamespaceSelectorDirective())
    .directive('ekOwnersSelector', () => new OwnersSelectorDirective())
    .directive('ekSearchFilter', () => new SearchFilterDirective())
    .directive('ekSelectUsers', () => new SelectUsersDirective())
    .directive('ekUserInfo', () => new UserInfoDirective());

export default moduleName;

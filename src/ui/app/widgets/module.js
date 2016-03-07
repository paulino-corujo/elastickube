import 'angular-material/angular-material';

import coreModule from 'core/module';

import ConfirmDialogService from './confirm-dialog.service';

import AvatarDirective from './ek-avatar/ek-avatar.directive';
import ButtonGroupDirective from './ek-button-group/ek-button-group.directive';
import ConfirmDirective from './ek-confirm/ek-confirm.directive';
import DonutChartDirective from './ek-donut-chart/ek-donut-chart.directive';
import DropDirective from './ek-drop/ek-drop.directive';
import DropContentDirective from './ek-drop/ek-drop-content.directive.js';
import DropTargetDirective from './ek-drop/ek-drop-target.directive.js';
import HeaderDirective from './ek-header/ek-header.directive';
import IkonDirective from './ek-ikon/ek-ikon.directive';
import InsertEmailsDirective from './ek-insert-emails/ek-insert-emails.directive';
import InsertLabelsDirective from './ek-insert-labels/ek-insert-labels.directive';
import InstanceNameDirective from './ek-instance-name/ek-instance-name.directive';
import InstanceStateDirective from './ek-instance-state/ek-instance-state.directive';
import LabelsDirective from './ek-labels/ek-labels.directive';
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
    .service('ekConfirmDialog', ConfirmDialogService)

    .directive('ekAvatar', () => new AvatarDirective())
    .directive('ekButtonGroup', () => new ButtonGroupDirective())
    .directive('ekConfirm', ($compile, $rootScope) => {
        'ngInject';

        return new ConfirmDirective($compile, $rootScope);
    })
    .directive('ekDrop', () => new DropDirective())
    .directive('ekDropContent', () => new DropContentDirective())
    .directive('ekDropTarget', () => new DropTargetDirective())
    .directive('ekDonutChart', () => new DonutChartDirective())
    .directive('ekHeader', () => new HeaderDirective())
    .directive('ekIkon', () => new IkonDirective())
    .directive('ekInsertEmails', () => new InsertEmailsDirective())
    .directive('ekInsertLabels', () => new InsertLabelsDirective())
    .directive('ekLabels', () => new LabelsDirective())
    .directive('ekInstanceName', () => new InstanceNameDirective())
    .directive('ekInstanceState', () => new InstanceStateDirective())
    .directive('ekNamespaceSelector', () => new NamespaceSelectorDirective())
    .directive('ekOwnersSelector', () => new OwnersSelectorDirective())
    .directive('ekSearchFilter', () => new SearchFilterDirective())
    .directive('ekSelectUsers', () => new SelectUsersDirective())
    .directive('ekUserInfo', () => new UserInfoDirective());

export default moduleName;

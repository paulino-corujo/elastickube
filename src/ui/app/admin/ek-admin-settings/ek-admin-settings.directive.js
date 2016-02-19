import './ek-admin-settings.less';
import icons from '../icons';
import Directive from 'directive';
import Controller from './ek-admin-settings.controller';
import template from './ek-admin-settings.html';

class AdminSettingsDirective extends Directive {
    constructor() {
        super({ Controller, template });
    }

    compile(tElement) {
        tElement.addClass('ek-admin-settings');

        return ($scope) => _.extend($scope, { icons });
    }
}

export default AdminSettingsDirective;
